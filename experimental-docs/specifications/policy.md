# Telemetry Policy Specification

**Status:** Development

**Protobuf:**
[`opentelemetry/proto/policies/v1development`](../../opentelemetry/proto/policies/v1development)

<details>
<summary>Table of Contents</summary>

<!-- START doctoc -->

- [Abstract](#abstract)
- [Overview](#overview)
- [Design Principles](#design-principles)
- [Policy Structure](#policy-structure)
- [Matching](#matching)
  - [Field Selection](#field-selection)
  - [AttributePath](#attributepath)
  - [Predicates](#predicates)
  - [Typed Values](#typed-values)
  - [Identifier Fields](#identifier-fields)
  - [Negation](#negation)
- [Log Filter Policy](#log-filter-policy)
  - [Log Selectors](#log-selectors)
- [Log Transform Policy](#log-transform-policy)
  - [Execution Order](#execution-order)
  - [Remove](#remove)
  - [Redact](#redact)
  - [Rename](#rename)
  - [Add](#add)
- [Metric Filter Policy](#metric-filter-policy)
  - [Granularity](#granularity)
  - [Metric Selectors](#metric-selectors)
- [Trace Sampling Policy](#trace-sampling-policy)
  - [Trace Selectors](#trace-selectors)
  - [Span Events](#span-events)
  - [Sampling Modes](#sampling-modes)
  - [Tracestate Handling](#tracestate-handling)
- [Evaluation Model](#evaluation-model)
  - [Stages](#stages)
  - [Precedence](#precedence)
  - [Match Tracking](#match-tracking)
- [Validation and Error Handling](#validation-and-error-handling)
  - [Parse Errors](#parse-errors)
  - [Compilation Errors](#compilation-errors)
  - [Runtime Errors](#runtime-errors)
- [YAML Representation](#yaml-representation)
- [Conformance](#conformance)
- [Implementation Notes](#implementation-notes)
  - [Choosing a Regular Expression Engine](#choosing-a-regular-expression-engine)
  - [Identifier Comparison](#identifier-comparison)
- [Design Decisions and Tradeoffs](#design-decisions-and-tradeoffs)
  - [One atomic policy type per intent](#one-atomic-policy-type-per-intent)
  - [The envelope is optional](#the-envelope-is-optional)
  - [A typed action, not a polymorphic keep string](#a-typed-action-not-a-polymorphic-keep-string)
  - [Keep overrides drop, most restrictive within sampling](#keep-overrides-drop-most-restrictive-within-sampling)
  - [Traces carry sampling only](#traces-carry-sampling-only)
  - [One shared predicate message](#one-shared-predicate-message)
  - [The target is a message, not an inline oneof](#the-target-is-a-message-not-an-inline-oneof)
  - [The target never carries the expected value](#the-target-never-carries-the-expected-value)
  - [`exists` is `google.protobuf.Empty`](#exists-is-googleprotobufempty)
  - [A small predicate set](#a-small-predicate-set)
  - [`regex` is an unanchored partial match](#regex-is-an-unanchored-partial-match)
  - [Identifier fields are matched as hexadecimal text](#identifier-fields-are-matched-as-hexadecimal-text)
  - [`contains` is typed and covers arrays](#contains-is-typed-and-covers-arrays)
  - [An attribute path, with array indices](#an-attribute-path-with-array-indices)
  - [Metric granularity follows the matchers](#metric-granularity-follows-the-matchers)
  - [Scope fields are shared, resource schema URL is removed](#scope-fields-are-shared-resource-schema-url-is-removed)
  - [Span events use an "any" quantifier, links are deferred](#span-events-use-an-any-quantifier-links-are-deferred)
  - [Log sampling and rate limiting are deferred](#log-sampling-and-rate-limiting-are-deferred)
  - [A transform inserts a typed value](#a-transform-inserts-a-typed-value)
  - [The transport is out of scope](#the-transport-is-out-of-scope)
- [Deferred Features](#deferred-features)
- [References](#references)

<!-- END doctoc -->

</details>

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD",
"SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be
interpreted as described in [RFC 2119](https://www.rfc-editor.org/rfc/rfc2119).

## Abstract

This document specifies the structure and the semantics of a telemetry policy. A
policy is an atomic, portable rule that keeps, drops, samples, or modifies
telemetry. Policies reference the OpenTelemetry data model, so one policy runs
unchanged in an SDK, in a Collector, or in any other component that implements
this specification.

## Overview

A policy declares one intent: match specific telemetry, then apply one action. A
policy is an independent unit. A policy MUST NOT reference another policy, and a
policy MUST NOT depend on its position in a list. This independence lets a
consumer evaluate a large policy set in parallel without coordination.

This document defines four policy types:

| Policy                | Signal  | Effect                                 |
| --------------------- | ------- | -------------------------------------- |
| `LogFilterPolicy`     | Logs    | Keeps or drops a log record.           |
| `LogTransformPolicy`  | Logs    | Modifies a surviving log record.       |
| `MetricFilterPolicy`  | Metrics | Keeps or drops a metric or data point. |
| `TraceSamplingPolicy` | Traces  | Samples a span by probability.         |

## Design Principles

This specification follows the
[OpenTelemetry Specification Principles](https://opentelemetry.io/docs/specs/otel/specification-principles/),
with these additional constraints:

- **Atomic.** One policy carries one matcher list and one action.
- **Self-contained.** A policy MUST NOT reference another policy.
- **Commutative.** The order of a policy set MUST NOT change the outcome of a
  filter decision or a sampling decision.
- **Fail-open.** An invalid, malformed, or failing policy MUST NOT cause
  telemetry loss.
- **Safe by default.** Telemetry that no policy matches passes through
  unchanged.
- **Uniform.** The predicate set, the value types, and the path syntax are
  identical across every signal.

## Policy Structure

A bare policy message carries only its matchers and its action. A transport that
supplies its own identity and lifecycle, such as an xDS resource or an OpAMP
custom message, MAY carry a bare policy message.

A transport that does not supply an identity SHOULD carry the `Policy` envelope,
which adds operator metadata:

| Field         | Type          | Default | Description                              |
| ------------- | ------------- | ------- | ---------------------------------------- |
| `id`          | string        | -       | REQUIRED. Unique within its scope.       |
| `name`        | string        | empty   | A short name for an operator to read.    |
| `description` | string        | empty   | The purpose of the policy.               |
| `enabled`     | optional bool | `true`  | Whether a consumer evaluates the policy. |
| `labels`      | `KeyValue[]`  | empty   | Operator metadata. Not interpreted.      |
| `definition`  | oneof         | -       | REQUIRED. Exactly one policy type.       |

A consumer MUST treat a policy with `enabled` set to `false` as absent. Such a
policy MUST NOT match, keep, drop, sample, or transform any telemetry.

`PolicySet` carries a complete set of policies. A consumer that receives a new
`PolicySet` MUST replace its whole set.

## Matching

Every policy type carries a `matches` list. A consumer combines the matchers
with AND: every matcher MUST report true before the policy applies.

A policy MUST carry at least one matcher. A consumer MUST reject a policy with
an empty `matches` list. This rule prevents a drop policy from matching every
record by accident.

A matcher has three parts:

| Part        | Description                                           |
| ----------- | ----------------------------------------------------- |
| `target`    | REQUIRED. What to inspect.                            |
| `predicate` | REQUIRED. How to compare the value that target reads. |
| `negate`    | OPTIONAL. Inverts the result. Defaults to `false`.    |

The target says **what to read**. The predicate says **how to compare it**. A
target never carries an expected value, and a predicate never names a field:

```yaml
# Read the span kind, then compare it to "SERVER".
- target: { record_field: SPAN_RECORD_FIELD_KIND }
  predicate: { equals: SERVER }
```

Because the value lives in the predicate, every predicate works against every
target. The same `SPAN_RECORD_FIELD_KIND` target accepts a different comparison
without a schema change:

```yaml
# Match a server span or a consumer span.
- target: { record_field: SPAN_RECORD_FIELD_KIND }
  predicate: { regex: "^(SERVER|CONSUMER)$" }
```

A design that put the value in the target, such as `span_kind: SERVER`, would
force a dummy predicate and could never express the second matcher.

Every signal shares one predicate set, so a matcher differs between signals only
in its target. These three matchers read a log record, a metric data point, and
a span, and the predicate is identical in all three:

```yaml
- target: { log_attribute: ["http.response.status_code"] }
  predicate: { gte: 500 }
- target: { datapoint_attribute: ["http.response.status_code"] }
  predicate: { gte: 500 }
- target: { span_attribute: ["http.response.status_code"] }
  predicate: { gte: 500 }
```

### Field Selection

A selector MUST set exactly one variant.

Every signal offers these four variants:

| Variant              | Type            | Description                         |
| -------------------- | --------------- | ----------------------------------- |
| `resource_attribute` | `AttributePath` | A resource attribute.               |
| `scope_attribute`    | `AttributePath` | An instrumentation scope attribute. |
| `scope_field`        | `ScopeField`    | A first-class scope field.          |
| `<signal>_attribute` | `AttributePath` | The signal's own attributes.        |

`ScopeField` holds `SCOPE_FIELD_NAME`, `SCOPE_FIELD_VERSION`, and
`SCOPE_FIELD_SCHEMA_URL`.

Each signal adds its own first-class field enum and, where it applies, extra
variants. See the section for that signal.

### AttributePath

An `AttributePath` locates an attribute by a list of segments.

- One segment selects a flat attribute: `["http.route"]`.
- Several segments traverse nested maps: `["http", "request", "method"]`.
- A segment that is a non-negative base-10 integer indexes an array value:
  `["items", "0", "id"]`.
- An empty path is invalid.

The protobuf wraps the list in a message because proto3 forbids a `repeated`
field inside a `oneof`. When a consumer reads YAML or JSON it MUST accept all
three forms below:

```yaml
# Canonical
log_attribute:
  path: ["http", "method"]

# Array shorthand
log_attribute: ["http", "method"]

# String shorthand, single segment only
log_attribute: "user_id"
```

When a consumer writes YAML or JSON it SHOULD emit the array shorthand.

### Predicates

A matcher MUST set exactly one predicate.

| Predicate  | Argument       | Matches when                                          |
| ---------- | -------------- | ----------------------------------------------------- |
| `exists`   | `Empty`        | The target is present.                                |
| `equals`   | `Value`        | The target value equals the scalar.                   |
| `regex`    | string         | The target string value satisfies the RE2 expression. |
| `gt`       | `NumericValue` | The target number is greater than the argument.       |
| `gte`      | `NumericValue` | The target number is greater than or equal to it.     |
| `lt`       | `NumericValue` | The target number is less than the argument.          |
| `lte`      | `NumericValue` | The target number is less than or equal to it.        |
| `contains` | `Value`        | The target value holds the scalar. See below.         |

#### **`exists`**

For an attribute, the target is present when the key exists. For a first-class
field that carries no presence information in the OpenTelemetry data model, the
target is present when the field holds a non-default value. To test for absence,
pair `exists` with `negate: true`.

#### **`regex`**

A consumer MUST use [RE2 syntax](https://github.com/google/re2/wiki/Syntax). The
expression is an **unanchored partial match**, as Go `regexp.MatchString` and
OTTL `IsMatch` define it. To require a full match, supply the anchors `^` and
`$`. To match without regard to case, supply the flag `(?i)`. The predicate
applies only to a string target value.

Without the flag `(?m)`, `^` matches only at the start of the target value, and
`$` matches only at its end. `$` MUST NOT match before a trailing newline. This
rule is normative because the PCRE family and the RE2 family disagree on it by
default: `^ERROR$` MUST reject the value `"ERROR\n"`.

A consumer MUST reject a pattern that RE2 syntax does not accept, such as a
backreference or a lookaround assertion. This rule keeps a policy portable, and
it keeps evaluation linear in the length of the target value, so a policy author
cannot push an expression that exhausts the consumer.

The engine is not fixed. A consumer MAY use any regular expression engine whose
accepted language covers RE2 syntax and whose results agree with the rules
above. See [Implementation Notes](#implementation-notes).

#### **`contains`**

The meaning follows the type of the target value:

- An array value matches when any element equals the scalar.
- A string value matches when it holds `string_value` as a substring.
- A bytes value matches when it holds `bytes_value` as a subsequence.

**Type mismatch.** A predicate MUST NOT raise an error. A target value of the
wrong type simply does not match. A consumer MUST NOT drop or modify telemetry
because of a type mismatch.

### Typed Values

`Value` holds one scalar. `NumericValue` holds one number.

```
Value {
  // exactly one of:
  string_value: string
  int_value:    int64
  bool_value:   bool
  double_value: double
  bytes_value:  bytes
}

NumericValue {
  // exactly one of:
  int_value:    int64
  double_value: double
}
```

`equals` matches when the target value has the same type and the same value as
the argument. An integer and a double are compared in one numeric domain, so an
`int_value` argument MAY match a double target with an equal numeric value, and
the reverse. Every other pairing of types does not match.

`gt`, `gte`, `lt`, and `lte` take a `NumericValue`, so a comparison against a
boolean, a string, or a byte sequence is unrepresentable rather than rejected at
compile time. `int_value` holds full 64-bit precision for a large integer field,
such as a nanosecond timestamp, that a double cannot hold exactly.

When a consumer reads YAML or JSON it MUST accept scalar shorthand. The type of
the literal selects the variant:

```yaml
- log_attribute: ["http.response.status_code"]
  gte: 500 # int_value
- log_attribute: ["sampling.ratio"]
  lt: 0.5 # double_value
- log_attribute: ["cache.hit"]
  equals: true # bool_value
- resource_attribute: ["service.name"]
  equals: checkout-api # string_value
```

### Identifier Fields

A trace id, a span id, and a parent span id are byte sequences in the
OpenTelemetry data model. Every predicate reads them as their **canonical
lowercase hexadecimal text**: 32 characters for a trace id, 16 characters for a
span id and a parent span id. This is how an identifier appears in the W3C
`traceparent` header and throughout OpenTelemetry.

An author therefore writes `equals` with a `string_value`:

```yaml
- record_field: SPAN_RECORD_FIELD_TRACE_ID
  equals: "4bf92f3577b34da6a3ce929d0e0e4736"
```

A consumer SHOULD decode the literal to raw bytes once, when it compiles the
policy, and then compare raw bytes at evaluation time. The text form is the
authoring contract, not a required runtime representation.

`bytes_value` exists for an attribute that carries raw bytes whose type the
selector does not reveal.

### Negation

When `negate` is `true`, the consumer inverts the result of the predicate. A
matcher that would match does not match, and the reverse.

## Log Filter Policy

`LogFilterPolicy` keeps or drops a log record. A consumer evaluates each log
record on its own.

```
LogFilterPolicy {
  matches: LogMatcher[]  // REQUIRED, at least one
  action:  Action        // REQUIRED, ACTION_KEEP or ACTION_DROP
}
```

A policy with an unset action, or with `ACTION_UNSPECIFIED`, is invalid.

### Log Selectors

| Variant              | Type             |
| -------------------- | ---------------- |
| `record_field`       | `LogRecordField` |
| `log_attribute`      | `AttributePath`  |
| `resource_attribute` | `AttributePath`  |
| `scope_attribute`    | `AttributePath`  |
| `scope_field`        | `ScopeField`     |

`LogRecordField` values:

| Value                              | Read as                                                          |
| ---------------------------------- | ---------------------------------------------------------------- |
| `LOG_RECORD_FIELD_BODY`            | The body.                                                        |
| `LOG_RECORD_FIELD_SEVERITY_TEXT`   | Text, for example `"INFO"`.                                      |
| `LOG_RECORD_FIELD_SEVERITY_NUMBER` | A number from 1 to 24. `regex` reads the canonical base-10 text. |
| `LOG_RECORD_FIELD_TRACE_ID`        | 32-character lowercase hexadecimal text.                         |
| `LOG_RECORD_FIELD_SPAN_ID`         | 16-character lowercase hexadecimal text.                         |
| `LOG_RECORD_FIELD_EVENT_NAME`      | The event name.                                                  |

## Log Transform Policy

`LogTransformPolicy` modifies a log record that survives the filter stage.

```
LogTransformPolicy {
  matches: LogMatcher[]  // REQUIRED, at least one
  remove:  LogRemove[]   // OPTIONAL
  redact:  LogRedact[]   // OPTIONAL
  rename:  LogRename[]   // OPTIONAL
  add:     LogAdd[]      // OPTIONAL
}
```

A policy MUST carry at least one operation.

### Execution Order

A consumer MUST apply the operations in this order and MUST NOT reorder them:

1. **Remove.** Delete the field.
2. **Redact.** Mask the field value.
3. **Rename.** Change the field key.
4. **Add.** Insert the field.

### Remove

```
LogRemove { target: LogFieldSelector }  // REQUIRED
```

A target that is absent yields no change.

### Redact

```
LogRedact {
  target:      LogFieldSelector  // REQUIRED
  replacement: string            // OPTIONAL, defaults to "[REDACTED]"
  regex:       string            // OPTIONAL
}
```

A target that is absent yields no change.

When `regex` is unset, the consumer replaces the whole field value with
`replacement`.

When `regex` is set, the consumer evaluates the RE2 expression against the
current string value of the field:

- An expression that does not match yields no change.
- An expression that matches replaces **every** non-overlapping full match, not
  only the first one.
- A capture group supplies text for the template. A capture group MUST NOT widen
  or narrow the replaced range.
- A field value that is not a string yields no change.

When `regex` is set, `replacement` is a template. A consumer MUST support:

| Syntax           | Expands to                |
| ---------------- | ------------------------- |
| `$0`             | The full match.           |
| `$1` - `$99`     | A numbered capture group. |
| `${1}` - `${99}` | A numbered capture group. |
| `${name}`        | A named capture group.    |
| `$$`             | A literal dollar sign.    |

A reference to an absent capture group MUST expand to the empty string.

### Rename

```
LogRename {
  from:   LogFieldSelector  // REQUIRED
  to:     string            // REQUIRED, non-empty
  upsert: bool              // OPTIONAL, defaults to false
}
```

A source that is absent yields no change. When `upsert` is `false` and the
destination already holds a value, the operation yields no change. When `upsert`
is `true`, the consumer overwrites the destination.

### Add

```
LogAdd {
  target: LogFieldSelector  // REQUIRED
  value:  Value             // REQUIRED
  upsert: bool              // OPTIONAL, defaults to false
}
```

When `upsert` is `false` and the field already holds a value, the operation
yields no change. When `upsert` is `true`, the consumer overwrites the field.

## Metric Filter Policy

`MetricFilterPolicy` keeps or drops a metric stream, or single data points of a
metric stream.

```
MetricFilterPolicy {
  matches: MetricMatcher[]  // REQUIRED, at least one
  action:  Action           // REQUIRED
}
```

### Granularity

The matchers set the granularity:

- **Instrument level.** When every matcher selects `descriptor_field`,
  `resource_attribute`, `scope_attribute`, or `scope_field`, the action applies
  to the whole metric stream.
- **Data point level.** When any matcher selects `datapoint_attribute`, the
  action applies to each data point on its own. A drop prunes the matching data
  points and leaves the rest of the stream in place.

A consumer that prunes every data point of a metric stream MUST drop the empty
metric. A consumer MUST also drop a `ScopeMetrics` or a `ResourceMetrics` that
the prune leaves empty.

### Metric Selectors

| Variant               | Type                    |
| --------------------- | ----------------------- |
| `descriptor_field`    | `MetricDescriptorField` |
| `datapoint_attribute` | `AttributePath`         |
| `resource_attribute`  | `AttributePath`         |
| `scope_attribute`     | `AttributePath`         |
| `scope_field`         | `ScopeField`            |

`MetricDescriptorField` values:

| Value                                             | Read as                                                                                 |
| ------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `METRIC_DESCRIPTOR_FIELD_NAME`                    | The metric name.                                                                        |
| `METRIC_DESCRIPTOR_FIELD_DESCRIPTION`             | The description.                                                                        |
| `METRIC_DESCRIPTOR_FIELD_UNIT`                    | The unit.                                                                               |
| `METRIC_DESCRIPTOR_FIELD_TYPE`                    | `"GAUGE"`, `"SUM"`, `"HISTOGRAM"`, `"EXPONENTIAL_HISTOGRAM"`, or `"SUMMARY"`.           |
| `METRIC_DESCRIPTOR_FIELD_AGGREGATION_TEMPORALITY` | `"DELTA"` or `"CUMULATIVE"`. A type that carries no temporality does not match.         |
| `METRIC_DESCRIPTOR_FIELD_IS_MONOTONIC`            | A boolean. `regex` reads `"true"` or `"false"`. A type other than a Sum does not match. |

## Trace Sampling Policy

`TraceSamplingPolicy` samples a span by probability. It follows the
[OpenTelemetry probability sampling specification](https://opentelemetry.io/docs/specs/otel/trace/tracestate-probability-sampling/).

```
TraceSamplingPolicy {
  matches:  TraceMatcher[]  // REQUIRED, at least one
  sampling: SamplingConfig  // REQUIRED
}

SamplingConfig {
  percentage:         float  // REQUIRED, 0 to 100
  mode:               SamplingMode  // OPTIONAL, defaults to hash_seed
  sampling_precision: uint32 // OPTIONAL, defaults to 4, range 1 to 14
  hash_seed:          uint32 // OPTIONAL, defaults to 0
  fail_closed:        bool   // OPTIONAL, defaults to true
}
```

A consumer compares a 56-bit randomness value R against a rejection threshold T,
and keeps the span when R is greater than or equal to T. The percentage sets the
threshold:

```
T = (1 - percentage / 100) * 2^56
```

A `percentage` of 0 drops every matching span. A `percentage` of 100 or more
keeps every matching span. A value outside the range 0 to 100 is invalid. One
policy type therefore covers a deterministic drop and a deterministic keep as
well as a probability.

A consumer evaluates each span on its own and MUST NOT reassemble a trace. A
dropped span therefore leaves its children behind, with a parent span id that
names a span no longer in the stream. A consumer SHOULD document this effect.

### Trace Selectors

| Variant              | Type              |
| -------------------- | ----------------- |
| `record_field`       | `SpanRecordField` |
| `span_attribute`     | `AttributePath`   |
| `resource_attribute` | `AttributePath`   |
| `scope_attribute`    | `AttributePath`   |
| `scope_field`        | `ScopeField`      |
| `event_attribute`    | `AttributePath`   |

`SpanRecordField` values:

| Value                              | Read as                                                                                                            |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `SPAN_RECORD_FIELD_NAME`           | The span name.                                                                                                     |
| `SPAN_RECORD_FIELD_TRACE_ID`       | 32-character lowercase hexadecimal text.                                                                           |
| `SPAN_RECORD_FIELD_SPAN_ID`        | 16-character lowercase hexadecimal text.                                                                           |
| `SPAN_RECORD_FIELD_PARENT_SPAN_ID` | 16-character lowercase hexadecimal text. A root span reads the empty text, and `exists` reports false.             |
| `SPAN_RECORD_FIELD_TRACE_STATE`    | The W3C tracestate.                                                                                                |
| `SPAN_RECORD_FIELD_STATUS_MESSAGE` | The status message.                                                                                                |
| `SPAN_RECORD_FIELD_KIND`           | `"INTERNAL"`, `"SERVER"`, `"CLIENT"`, `"PRODUCER"`, or `"CONSUMER"`. A span with an unset kind reads `"INTERNAL"`. |
| `SPAN_RECORD_FIELD_STATUS_CODE`    | `"UNSET"`, `"OK"`, or `"ERROR"`.                                                                                   |
| `SPAN_RECORD_FIELD_EVENT_NAME`     | The name of a span event. See below.                                                                               |

### Span Events

`SPAN_RECORD_FIELD_EVENT_NAME` and `event_attribute` read the event list of the
span. The quantifier is **any**: the matcher reports true when at least one
event satisfies the predicate. A span with no event does not match.

`negate` inverts the whole matcher, not the quantifier. A matcher with
`event_name`, `equals: "exception"`, and `negate: true` therefore reports true
for a span that carries no exception event.

### Sampling Modes

| Mode                         | Description                                                                                                                                              |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SAMPLING_MODE_HASH_SEED`    | Hashes the trace id with `hash_seed` for a deterministic decision. Every consumer in one tier that shares a seed reaches the same decision. The default. |
| `SAMPLING_MODE_PROPORTIONAL` | Multiplies the arriving probability by `percentage`. Reduces traffic by a fixed factor whatever the arriving threshold.                                  |
| `SAMPLING_MODE_EQUALIZING`   | Raises every span to one common threshold. A span whose arriving threshold is already more restrictive keeps that threshold.                             |

`fail_closed` sets the behavior when the sampling raises an error. When it is
`true`, the consumer drops the span. When it is `false`, the consumer keeps it.

### Tracestate Handling

A consumer MUST follow the
[OpenTelemetry tracestate handling specification](https://opentelemetry.io/docs/specs/otel/trace/tracestate-handling/#sampling-threshold-value-th)
so that several stages can sample one trace:

- The consumer MUST encode the threshold in the `th` sub-key of the `ot`
  tracestate entry.
- The threshold is a 56-bit value, encoded as 1 to 14 lowercase hexadecimal
  digits with trailing zeros removed. `sampling_precision` sets the digit count.
- A downstream sampler MAY raise a threshold. A downstream sampler MUST NOT
  lower one.

## Evaluation Model

### Stages

```
                 ┌────────┐   ┌────────┐   ┌───────────┐
Telemetry ──────▶│ Filter │──▶│ Sample │──▶│ Transform │──▶ Out
                 └────────┘   └────────┘   └───────────┘
                  logs         traces        logs
                  metrics
```

A consumer MAY evaluate policies concurrently within a stage. Policies are
independent, so a stage needs no coordination.

Telemetry that a stage removes MUST NOT reach a later stage.

### Precedence

**Default disposition.** Telemetry that no policy matches passes through
unchanged.

**Filter stage.** This stage applies to logs and to metrics. Among the filter
policies that match one record:

1. When any policy states `ACTION_KEEP`, the consumer keeps the record.
2. Otherwise, when any policy states `ACTION_DROP`, the consumer drops the
   record.
3. Otherwise the record continues unchanged.

`ACTION_KEEP` is therefore an exemption, not an allowlist: it retains the
records it matches and does not prune the records it does not match. To build an
allowlist, write `ACTION_DROP` with `negate: true` on the matchers.

**Sampling stage.** This stage applies to traces. Among the sampling policies
that match one span, the consumer applies the **most restrictive**
configuration, which is the one with the highest threshold T, and so the lowest
effective probability. When the policies tie on threshold, the consumer MAY
apply any one of them.

A span therefore has no keep-overrides-drop rule. A `percentage` of 100 states
an intent to keep, but a policy with a lower percentage still wins, because a
higher percentage has no sound claim over a lower one.

**Transform stage.** Every matching transform policy contributes its operations.
The operations run in the order `remove`, `redact`, `rename`, `add` across the
union of all matching policies. When two policies target one field within one
operation type, the result is implementation-defined but MUST be deterministic.
A consumer MUST break the tie in a stable order, for example by policy
identifier.

This rule set is commutative: the outcome does not depend on the order of the
policy set.

### Match Tracking

A consumer SHOULD report two counters, so that an operator can see how much
telemetry a policy set saw and whether each policy has the effect it intends.

| Counter                  | Counts                                     |
| ------------------------ | ------------------------------------------ |
| `policy.consumed.items`  | Every datum that enters policy evaluation. |
| `policy.evaluated.items` | Every datum that a policy matched.         |

Both counters are monotonic integer sums with the unit `{item}`. A consumer
increments a counter once per telemetry datum, where a datum is one log record,
one metric data point, or one span. A metric data point is the unit for metrics,
not a metric stream.

Both counters carry attributes rather than encode a dimension in the name:

| Attribute   | On                       | Values                      |
| ----------- | ------------------------ | --------------------------- |
| `signal`    | Both counters            | `logs`, `metrics`, `traces` |
| `policy.id` | `policy.evaluated.items` | The `id` of the policy.     |
| `outcome`   | `policy.evaluated.items` | `hit`, `miss`               |

This specification names the counters and the attributes. It does not fix a
prefix, because a policy runs in an SDK as well as in a Collector. An
implementation SHOULD map these names onto the convention of its host. A
Collector, for example, emits `otelcol.policy.consumed.items`.

**`policy.consumed.items`.** A consumer MUST increment this counter when a datum
enters policy evaluation, before the filter, sampling, and transform stages run.
A dropped datum, a sampled-out datum, and a redacted datum therefore all count,
in the shape in which they arrived. A consumer MUST also count a datum that no
policy matched, and a datum of a signal for which it holds no policy at all. The
counter is the denominator that `policy.evaluated.items` needs: without it, an
operator cannot tell whether a policy that reports 400 matches saw 500 records
or 5 million.

**`policy.evaluated.items`.** A consumer MUST increment this counter only for a
policy whose matchers report true. The `outcome` attribute records whether the
final result honored the intent of that policy:

- `hit` when the final outcome honors the intent of the policy.
- `miss` when another policy overrides that intent.

Under the precedence rules above:

| Situation                                              | `outcome = hit`                 | `outcome = miss`                      |
| ------------------------------------------------------ | ------------------------------- | ------------------------------------- |
| A keep policy and a drop policy match. Record is kept. | The keep policy.                | The drop policy.                      |
| Only drop policies match. Record is dropped.           | Every drop policy.              | None.                                 |
| A sampling decision keeps the span.                    | Every matching sampling policy. | None.                                 |
| A sampling decision drops the span.                    | The most restrictive policy.    | Every other matching sampling policy. |

Because both counters share one unit, the match rate of a policy is one division
within one metric family:

```
sum(policy.evaluated.items{policy.id = P})
  / sum(policy.consumed.items{signal = S})
```

**Absent is not zero.** Tracking is optional, and each counter is optional on
its own. A consumer that does not track a counter MUST omit it rather than
report it as `0`. A reader MUST NOT read a missing counter as an observation of
no telemetry.

**Draining a counter.** A transport that drains these counters rather than reads
them cumulatively MUST drain `policy.consumed.items` for a signal together with
every `policy.evaluated.items` series for that signal. Keeping one side of the
ratio while discarding the other skews the result. Such a transport MUST NOT
replay a drained counter, because a duplicate read counts the same telemetry
twice. A drained counter is therefore a lower bound on the telemetry a consumer
observed, not an exact total.

How a consumer reports these counters is outside the scope of this document.

## Validation and Error Handling

A consumer MUST be fail-open. A malformed, invalid, or failing policy MUST NOT
cause telemetry loss and MUST NOT modify telemetry incorrectly. A consumer MUST
isolate an error to the offending policy. Every other policy continues to run.

### Parse Errors

A policy that a consumer cannot decode from its serialized form MUST be skipped.
The consumer MUST continue to parse and run every other policy.

### Compilation Errors

A consumer validates each policy independently before it applies the policy to
telemetry. A policy is invalid when any of these hold:

| Condition                                                   | Example                                    |
| ----------------------------------------------------------- | ------------------------------------------ |
| The `matches` list is empty.                                | `matches: []`                              |
| A matcher sets no target.                                   | an empty `target` oneof                    |
| A matcher sets no predicate.                                | an empty `predicate` oneof                 |
| A selector names an unspecified enum value.                 | `LOG_RECORD_FIELD_UNSPECIFIED`             |
| An attribute path is empty.                                 | `log_attribute: []`                        |
| A `regex` predicate or a `redact` pattern is not valid RE2. | `regex: "([a-z"`                           |
| A typed value is unset.                                     | an empty `Value`                           |
| A filter policy has an unset action.                        | `action` absent                            |
| A sampling configuration is out of range.                   | `percentage: 150`, `sampling_precision: 0` |
| A transform policy carries no operation.                    | no `remove`, `redact`, `rename`, or `add`  |
| A `rename` has an empty `to`.                               | `to: ""`                                   |

A consumer:

- MUST keep an invalid policy inert. The policy MUST NOT match, keep, drop,
  sample, or transform any telemetry. A matcher that fails to compile MUST NOT
  fall back to a permissive value.
- MUST NOT abort the compilation of the other policies in the same batch.
- SHOULD collect every validation error for a policy rather than stop at the
  first, so that an operator can correct the whole policy in one pass.
- SHOULD report each error with its location within the policy, for example
  `matches[0]: attribute path is empty`.

### Runtime Errors

A runtime error occurs while a consumer applies a compiled, valid policy to one
record. The record MUST pass through unmodified by that policy. A runtime error
MUST NOT cause telemetry loss.

A type mismatch is not a runtime error. It is a non-match. See
[Predicates](#predicates).

## YAML Representation

Protocol Buffers is the canonical format. A YAML representation MUST map
directly onto the protobuf schema.

**Drop debug logs from one service.**

```yaml
id: drop-checkout-debug-logs
name: Drop checkout debug logs
log_filter:
  matches:
    - target: { resource_attribute: ["service.name"] }
      predicate: { equals: checkout-api }
    - target: { record_field: LOG_RECORD_FIELD_SEVERITY_TEXT }
      predicate: { equals: DEBUG }
  action: ACTION_DROP
```

**Always keep error logs, whatever another policy says.**

```yaml
id: keep-error-logs
name: Keep error logs
log_filter:
  matches:
    - target: { record_field: LOG_RECORD_FIELD_SEVERITY_NUMBER }
      predicate: { gte: 17 }
  action: ACTION_KEEP
```

**Redact an authorization header in place.**

```yaml
id: redact-http-auth-header
name: Redact HTTP authorization headers
log_transform:
  matches:
    - target: { log_attribute: ["http", "request", "headers", "authorization"] }
      predicate: { exists: {} }
  redact:
    - target: { log_attribute: ["http", "request", "headers", "authorization"] }
      regex: '(?i)^(bearer\s+).+$'
      replacement: "$1[REDACTED]"
```

**Prune healthy data points but keep the metric stream.**

```yaml
id: drop-ok-status-datapoints
name: Drop 200-status data points
metric_filter:
  matches:
    - target: { datapoint_attribute: ["http.response.status_code"] }
      predicate: { equals: 200 }
  action: ACTION_DROP
```

**Drop every histogram.**

```yaml
id: drop-histograms
name: Drop histogram metrics
metric_filter:
  matches:
    - target: { descriptor_field: METRIC_DESCRIPTOR_FIELD_TYPE }
      predicate: { regex: "^(HISTOGRAM|EXPONENTIAL_HISTOGRAM)$" }
  action: ACTION_DROP
```

**Drop health-check spans outright.**

```yaml
id: drop-health-check-spans
name: Drop health check spans
trace_sampling:
  matches:
    - target: { span_attribute: ["http.route"] }
      predicate: { regex: "^/(healthz|readyz)$" }
  sampling:
    percentage: 0.0
```

**Keep every span that carries an exception event.**

```yaml
id: keep-spans-with-exceptions
name: Keep spans with exception events
trace_sampling:
  matches:
    - target: { record_field: SPAN_RECORD_FIELD_EVENT_NAME }
      predicate: { equals: exception }
  sampling:
    percentage: 100.0
```

**Sample database spans at 5 percent.**

```yaml
id: sample-database-spans
name: Sample database spans at 5 percent
trace_sampling:
  matches:
    - target: { span_attribute: ["db.system.name"] }
      predicate: { exists: {} }
  sampling:
    percentage: 5.0
    mode: SAMPLING_MODE_EQUALIZING
```

## Conformance

A consumer conforms to this specification when it:

1. Parses a valid policy as this document defines it.
2. Evaluates a matcher with the specified target, predicate, and negation
   semantics.
3. Applies the [precedence](#precedence) rules across the filter, sampling, and
   transform stages.
4. Runs the transform operations in the order `remove`, `redact`, `rename`,
   `add`.
5. Stays fail-open for every error condition.
6. Honors the `enabled` field.
7. Validates a policy per the [compilation error](#compilation-errors) rules,
   keeps an invalid policy inert, and does not abort a valid policy in the same
   batch.
8. Counts any counter it chooses to report per the
   [match tracking](#match-tracking) semantics, carries the stated attributes,
   and omits a counter it does not track rather than report it as `0`.

A consumer MAY support a subset of the policy types. A consumer MUST document
every policy type and every feature it does not support. Tracking a counter is
optional, and each counter is optional on its own.

## Implementation Notes

This section is informative. It records guidance that the normative sections
above imply but do not state, and it does not add a requirement.

### Choosing a Regular Expression Engine

This document names RE2 as the required **syntax**, not as a required library. A
consumer MAY use any engine that accepts the RE2 grammar and agrees with the
semantics under [Predicates](#predicates). The two regular expression fields
place different demands on that engine.

| Field             | Needs                                                                                                    |
| ----------------- | -------------------------------------------------------------------------------------------------------- |
| `Predicate.regex` | One boolean answer: does the pattern match anywhere in the value.                                        |
| `LogRedact.regex` | The range of every non-overlapping match, plus each capture group that the `replacement` template reads. |

A consumer with a large policy set will scan one value against many patterns. A
multiple-pattern engine, such as
[Hyperscan](https://intel.github.io/hyperscan/dev-reference/), answers every
`Predicate.regex` in one pass over the value, where a single-pattern engine
needs one pass per pattern. That is a sound optimization, within these limits:

- **Captures are unavailable.** Hyperscan parses a capture group and then
  ignores it. It therefore cannot serve `LogRedact.regex`. A consumer that uses
  a multiple-pattern engine for the predicate still needs RE2, PCRE2, or an
  equivalent engine for the redact operation.
- **Anchors need care.** Hyperscan follows the PCRE rule, under which `$`
  matches before a trailing newline. A consumer MUST override that behavior to
  satisfy the normative rule in [Predicates](#predicates).
- **Unicode is opt-in.** Hyperscan treats a pattern as bytes until the verbs
  `(*UTF8)` and `(*UCP)` are set. A consumer that accepts a pattern with a
  Unicode class MUST set them.
- **Bounded repeats have limits.** A wide bound such as `a{1,60000}` compiles
  under RE2 and MAY fail to compile under Hyperscan. A consumer MUST treat such
  a failure as a [compilation error](#compilation-errors) for that one policy,
  and MUST keep every other policy running.
- **Lazy quantifiers change nothing.** Hyperscan accepts `*?` and then ignores
  it. A boolean answer does not depend on greed, so the result still agrees with
  RE2.

A common arrangement uses a multiple-pattern engine as a prefilter over the
whole policy set, then evaluates only the patterns that engine reports against a
single-pattern engine. The prefilter MUST NOT change any outcome. It only avoids
work.

### Identifier Comparison

[Identifier Fields](#identifier-fields) defines a trace id, a span id, and a
parent span id as hexadecimal text. That is the authoring contract, not a
required runtime representation. A consumer SHOULD decode the literal in the
policy to raw bytes once, when it compiles the policy, and then compare 8 or 16
raw bytes per record. Rendering the identifier of every record to a 32-character
string, only to compare strings, is far more expensive and yields the same
answer.

## Design Decisions and Tradeoffs

This section records each decision that resolves a difference between the input
designs, together with what the decision costs.

### One atomic policy type per intent

**Decision.** Each intent gets its own top-level message: `LogFilterPolicy`,
`LogTransformPolicy`, `MetricFilterPolicy`, and `TraceSamplingPolicy`. A policy
carries one matcher list and one action.

**Tradeoff.** Four wire types instead of one per signal. A single record that
needs both a filter rule and a transform rule now needs two policies, and the
matcher list is duplicated between them. In exchange, each policy stays small,
its validity is decidable on its own, and a new intent lands as a new type
rather than as a new mode inside an existing one.

### The envelope is optional

**Decision.** `Policy` carries `id`, `name`, `description`, `enabled`, and
`labels`, plus a `oneof` over the four policy types. A transport that already
supplies identity and lifecycle MAY carry a bare policy message instead.

**Tradeoff.** Two valid shapes on the wire, so a consumer must handle both. In
exchange, `enabled` survives, which no envelope-free design can express, and a
transport such as xDS that wraps a policy in `google.protobuf.Any` binds without
a redundant identity layer.

### A typed action, not a polymorphic keep string

**Decision.** A filter policy carries `optional Action action`, which is
`ACTION_KEEP` or `ACTION_DROP`. Sampling is a separate policy type with its own
typed configuration.

**Tradeoff.** The single, compact `keep` field that spelled `all`, `none`,
`50%`, and `100/s` is gone. Each of those now needs a distinct type, and two of
them are deferred. In exchange there is no string grammar to parse, no casing
bug, no ambiguity between an unset action and a default one, and a control plane
can validate a policy without a parser. `optional` gives explicit field presence
so declarative tooling tells "not configured" from "set to the zero value".

### Keep overrides drop, most restrictive within sampling

**Decision.** In the filter stage, which covers logs and metrics, `ACTION_KEEP`
always wins over `ACTION_DROP`. In the sampling stage, which covers traces, the
most restrictive configuration applies.

**Tradeoff.** A blanket keep policy can silently defeat a later drop policy, so
an author who wants a hard drop must be sure no keep policy matches the same
records. A "most restrictive wins" rule would make a drop unconditional instead.
The chosen rule is commutative, matches the safe-by-default principle, and gives
an operator one clear way to protect critical telemetry, such as error logs,
from a broad cost-control rule. Within sampling, "most restrictive" is the only
sound rule, because a higher percentage has no meaningful claim over a lower
one.

### Traces carry sampling only

**Decision.** Traces have one policy type, `TraceSamplingPolicy`. A `percentage`
of 0 expresses a deterministic drop and a `percentage` of 100 expresses a
deterministic keep.

**Tradeoff.** A span gets no exemption rule. A policy that states 100 percent
still loses to a policy that states 5 percent, so an author cannot protect a
span from a broad sampling rule the way `ACTION_KEEP` protects a log record. A
separate deterministic span filter would restore that, at the cost of a second
trace policy type and a second precedence rule for one signal. Sampling already
covers both ends of the range, so the extra type earns nothing until a concrete
need for the exemption appears. See [Deferred Features](#deferred-features).

### One shared predicate message

**Decision.** `Predicate` is defined once in `common.proto` and reused by
`LogMatcher`, `MetricMatcher`, and `TraceMatcher`.

**Tradeoff.** One extra level of message nesting on the wire, and one more
allocation per matcher in a naive decoder. In exchange the eight predicate
variants are defined once rather than three times, and they cannot drift apart
as new signals arrive.

### The target is a message, not an inline oneof

**Decision.** A matcher holds a `<Signal>FieldSelector` message rather than a
`oneof` on the matcher itself.

**Tradeoff.** Another level of nesting. In exchange `LogRemove`, `LogRedact`,
`LogRename`, and `LogAdd` all reuse `LogFieldSelector` instead of repeating the
same five-variant `oneof`. That removes five copies of the selector and the
"keep these in sync" hazard that comes with them.

### The target never carries the expected value

**Decision.** A metric type, an aggregation temporality, a monotonicity flag, a
span kind, and a span status code are all first-class **fields** on the
selector, read by a normal predicate against their canonical uppercase name.

**Tradeoff.** `descriptor_field: TYPE` with `equals: "HISTOGRAM"` is longer to
write than `metric_type: HISTOGRAM`, and it trades an enum for a string, so a
typo is caught at evaluation time rather than at compile time. In exchange the
predicate set stays universal, a matcher never needs a dummy predicate, and one
matcher can span several values with `regex: "HISTOGRAM|GAUGE"`. Placing the
expected value in the target also makes `negate` and the comparison predicates
meaningless for those fields, which the chosen form avoids.

### `exists` is `google.protobuf.Empty`

**Decision.** `exists` takes `google.protobuf.Empty`. Absence is expressed by
pairing `exists` with `negate: true`.

**Tradeoff.** `exists: {}` reads worse in YAML than `exists: true`. In exchange
the state `exists: false` combined with `negate: true`, which is a double
negative with no agreed meaning, becomes unrepresentable.

### A small predicate set

**Decision.** The predicate set is `exists`, `equals`, `regex`, `gt`, `gte`,
`lt`, `lte`, and `contains`. There is no `exact`, no `starts_with`, no
`ends_with`, and no matcher-level `case_insensitive` flag.

**Tradeoff.** A prefix match now reads `regex: "^/api/"` rather than
`starts_with: "/api/"`, and a case-insensitive match needs the `(?i)` flag. A
literal prefix match is also cheaper to evaluate than a regular expression, so a
consumer that cares loses a fast path unless it recognizes an anchored literal
pattern. In exchange there are four fewer variants to define, document, and
test, with no loss of expressiveness. `exact` is dropped entirely because
`equals` with a `string_value` covers it.

### `regex` is an unanchored partial match

**Decision.** A `regex` predicate is an unanchored partial match, as Go
`regexp.MatchString` and OTTL `IsMatch` define it.

**Tradeoff.** An author who expects full-string semantics will write a pattern
that matches more than intended until they add `^` and `$`. Leaving the question
open was the larger risk: two conformant consumers could otherwise disagree on
the same policy.

### Identifier fields are matched as hexadecimal text

**Decision.** A trace id, a span id, and a parent span id are read as canonical
lowercase hexadecimal text by every predicate. There is no separate hexadecimal
value variant.

**Tradeoff.** A consumer that stores an identifier as raw bytes must either
render it or, as recommended, decode the literal once at compile time. A
dedicated `hex_value` variant would make the byte comparison explicit on the
wire. The chosen form gives one representation per field, so `equals`, `regex`,
and `contains` all agree on what an identifier looks like, and an author never
has to know whether a given field is bytes or a string.

### `contains` is typed and covers arrays

**Decision.** `contains` takes a `Value`. It tests array membership, string
substring, and bytes subsequence, according to the type of the target.

**Tradeoff.** One name now carries three meanings, which a reader must learn. In
exchange a policy can match an element of an array attribute, which no
string-only form can express, and the predicate set gains no extra variant.

### An attribute path, with array indices

**Decision.** Every attribute selector takes an `AttributePath`. A segment that
is a non-negative integer indexes an array value.

**Tradeoff.** A path costs a list allocation where a flat string key would not,
and the overwhelming majority of OpenTelemetry attributes are flat keys. The
YAML shorthand hides the cost at authoring time, and a consumer can specialize
the single-segment case. A flat string would have made a nested map or an array
element unreachable without a later breaking change.

### Metric granularity follows the matchers

**Decision.** A matcher on `datapoint_attribute` shifts the action to the data
point level. Otherwise the action applies to the whole metric stream. A prune
that empties a metric drops the metric and any container it empties.

**Tradeoff.** The granularity is implicit in the matcher list, so an author
changes it by accident when they add a data point matcher to a stream-level
policy. A separate granularity field would be explicit but would allow an
invalid combination, such as a stream-level action driven by a data point
matcher. Leaving the rule undefined was not an option: a cardinality-control
policy that drops a whole metric stream when one data point matches destroys far
more telemetry than the author intends.

### Scope fields are shared, resource schema URL is removed

**Decision.** `ScopeField` holds the scope name, version, and schema URL, and
every signal shares it. There is no selector for the resource schema URL.

**Tradeoff.** A policy that matched on a resource schema URL can no longer be
expressed. The field is deprecated in the OpenTelemetry data model, so carrying
a selector for it would encode a dependency on a field that is on its way out.
Sharing `ScopeField` also fixes an asymmetry in which the scope name and version
were reachable for metrics and traces but not for logs.

### Span events use an "any" quantifier, links are deferred

**Decision.** `SPAN_RECORD_FIELD_EVENT_NAME` and `event_attribute` read the
event list of the span. A matcher reports true when at least one event satisfies
the predicate. Span links carry no selector.

**Tradeoff.** "Every event satisfies the predicate" cannot be expressed, and
`negate` inverts the whole matcher rather than the quantifier, which is easy to
misread. The alternative is an explicit quantifier field, which doubles the
surface for one use case. Events keep a selector because retaining a span that
carries an exception event is a common, concrete need. Links have no comparable
need yet and can be added later without a breaking change.

### Log sampling and rate limiting are deferred

**Decision.** This version defines no percentage sampling and no rate limit for
logs.

**Tradeoff.** Three real capabilities are absent: percentage sampling for logs,
a rate limit expressed as a count per window, and the consistent-sampling key
that keeps every log line of one request together. A cost-control policy set
must express those through a drop rule or through a component outside this
specification. They return as a `LogSamplingPolicy`, which needs no change to
any type defined here. See [Deferred Features](#deferred-features).

### A transform inserts a typed value

**Decision.** `LogAdd.value` is a `Value`, not a string.

**Tradeoff.** Slightly more to write for the common case of a string. In
exchange a policy can insert a boolean or a number without forcing a consumer to
guess the intended type from the text.

### The transport is out of scope

**Decision.** This document defines the policy schema and its evaluation
semantics. It does not define how a consumer receives a policy set or how it
reports the results.

**Tradeoff.** A conformant consumer still needs a transport binding, and
[Match Tracking](#match-tracking) defines counters with no channel to report
them on. Binding the schema to one transport, whether xDS, OpAMP, or a dedicated
sync protocol, would have blocked the others. The schema is transport-agnostic,
so each binding can land on its own.

## Deferred Features

These features are understood and intentionally absent. None requires a breaking
change to the types defined here.

| Feature                      | How it returns                                                  |
| ---------------------------- | --------------------------------------------------------------- |
| Deterministic span filtering | A `TraceFilterPolicy` with an `Action`, reusing `TraceMatcher`. |
| Log percentage sampling      | A `LogSamplingPolicy` with a sampling configuration.            |
| Log rate limiting            | A rate configuration on `LogSamplingPolicy`.                    |
| Consistent sampling key      | A selector field on `LogSamplingPolicy`.                        |
| Metric rate adjustment       | A `MetricRatePolicy`, reusing `MetricMatcher`.                  |
| Metric transformation        | A `MetricTransformPolicy`, reusing `MetricFieldSelector`.       |
| Trace transformation         | A `TraceTransformPolicy`, reusing `TraceFieldSelector`.         |
| Span link matching           | A `link_trace_id` variant on `TraceFieldSelector`.              |
| Metric value thresholds      | A data point value target on `MetricFieldSelector`.             |
| Boolean expression trees     | Out of scope. Write several policies for OR semantics.          |
| Transport binding            | A separate document per transport.                              |
| Policy provenance timestamps | Control plane metadata, outside the policy schema.              |

## References

- [OpenTelemetry Specification](https://opentelemetry.io/docs/specs/otel/)
- [OpenTelemetry Log Data Model](https://opentelemetry.io/docs/specs/otel/logs/data-model/)
- [OpenTelemetry Probability Sampling](https://opentelemetry.io/docs/specs/otel/trace/tracestate-probability-sampling/)
- [OpenTelemetry Tracestate Handling](https://opentelemetry.io/docs/specs/otel/trace/tracestate-handling/)
- [OTEP 4738: Telemetry Policy](https://github.com/open-telemetry/opentelemetry-specification/blob/main/oteps/4738-telemetry-policy.md)
- [RE2 Regular Expression Syntax](https://github.com/google/re2/wiki/Syntax)
- [RFC 2119](https://www.rfc-editor.org/rfc/rfc2119)
- [W3C Trace Context](https://www.w3.org/TR/trace-context/)
