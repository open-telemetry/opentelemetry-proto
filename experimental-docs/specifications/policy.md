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
  - [Mutation Selectors](#mutation-selectors)
  - [Rename](#rename)
  - [Add](#add)
  - [Remove](#remove)
  - [Redact](#redact)
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
  - [Match Outcome Semantics](#match-outcome-semantics)
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
  - [An attribute path](#an-attribute-path)
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

Every policy MUST be wrapped in the `Policy` envelope, which supplies a unique
identifier, lifecycle state, and operator metadata across all transports:

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

A filter policy (`LogFilterPolicy`, `MetricFilterPolicy`) MUST carry at least
one matcher; a consumer MUST reject a filter policy with an empty `matches`
list so that a filter policy cannot drop or keep every record by accident. On
`LogTransformPolicy` and `TraceSamplingPolicy`, `matches` MAY be empty, in
which case the policy matches every log record or span.

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
  predicate: { equals: { string_value: SERVER } }
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
- target: { log_attribute: { path: ["http.response.status_code"] } }
  predicate: { gte: { int_value: 500 } }
- target: { datapoint_attribute: { path: ["http.response.status_code"] } }
  predicate: { gte: { int_value: 500 } }
- target: { span_attribute: { path: ["http.response.status_code"] } }
  predicate: { gte: { int_value: 500 } }
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

An `AttributePath` locates an attribute or structured body field by a sequence
of map keys.

- One segment selects a top-level key: `["http.route"]`.
- Several segments traverse nested maps (`KeyValueList`):
  `["http", "request", "method"]`.
- Every segment is treated as a map key (if an intermediate value along the
  path is not a `KeyValueList` map, the target is treated as absent).
- An empty path is invalid.

The protobuf wraps the list in an `AttributePath` message:

```yaml
log_attribute:
  path: ["http", "method"]
```

### Predicates

A matcher MUST set exactly one predicate.

| Predicate  | Argument       | Matches when                                          |
| ---------- | -------------- | ----------------------------------------------------- |
| `exists`   | `Empty`        | The target is present.                                |
| `equals`   | `ScalarValue`  | The target value equals the scalar.                   |
| `regex`    | string         | The target string value satisfies the RE2 expression. |
| `gt`       | `NumericValue` | The target number is greater than the argument.       |
| `gte`      | `NumericValue` | The target number is greater than or equal to it.     |
| `lt`       | `NumericValue` | The target number is less than the argument.          |
| `lte`      | `NumericValue` | The target number is less than or equal to it.        |
| `contains` | `ScalarValue`  | The target value holds the scalar. See below.         |

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

`ScalarValue` holds one scalar. `NumericValue` holds one number.

```
ScalarValue {
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
the argument. An integer and a double are compared in one numeric domain by
exact mathematical value, so across `equals`, `contains`, `gt`, `gte`, `lt`, and
`lte`, an `int_value` argument MUST be compared against a `double` target (and a
`double_value` argument against an `int64` target) without losing 64-bit integer
precision (for example, `int64(2^53 + 1)` MUST NOT match `double(2^53)`). Any
comparison involving `NaN` evaluates to `false` (before `negate`). Every other
pairing of types does not match.

Examples:

```yaml
- target: { log_attribute: { path: ["http.response.status_code"] } }
  predicate: { gte: { int_value: 500 } }
- target: { log_attribute: { path: ["sampling.ratio"] } }
  predicate: { lt: { double_value: 0.5 } }
- target: { log_attribute: { path: ["cache.hit"] } }
  predicate: { equals: { bool_value: true } }
- target: { resource_attribute: { path: ["service.name"] } }
  predicate: { equals: { string_value: checkout-api } }
```

### Identifier Fields

A trace id, a span id, and a parent span id are byte sequences in the
OpenTelemetry data model. When present, every predicate reads them as their
**canonical lowercase hexadecimal text**: 32 characters for a trace id, 16
characters for a span id and a parent span id. This is how an identifier appears
in the W3C `traceparent` header and throughout OpenTelemetry. An empty or
all-zero byte sequence (16 zero bytes for a trace id, 8 zero bytes for a span id
or a parent span id) MUST be treated as absent: the `exists` predicate evaluates
to `false`, and a string predicate reads the empty text `""`.

An author therefore writes `equals` with a `string_value`:

```yaml
- target: { record_field: SPAN_RECORD_FIELD_TRACE_ID }
  predicate: { equals: { string_value: "4bf92f3577b34da6a3ce929d0e0e4736" } }
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

`LogFieldSelector` (used by `LogMatcher`) selects any field or attribute in
scope for a log record:

| Variant              | Type             | Description                                                 |
| -------------------- | ---------------- | ----------------------------------------------------------- |
| `record_field`       | `LogRecordField` | A first-class field of the log record.                      |
| `log_attribute`      | `AttributePath`  | A log record attribute.                                     |
| `resource_attribute` | `AttributePath`  | A resource attribute.                                       |
| `scope_attribute`    | `AttributePath`  | An instrumentation scope attribute.                         |
| `scope_field`        | `ScopeField`     | A first-class field of the instrumentation scope.           |
| `body_field`         | `AttributePath`  | A nested field inside a structured (`KeyValueList`) `body`. |

When `body_field` is selected and `LogRecord.body` is not a `KeyValueList` map
(or the path does not resolve inside it), the target is treated as absent.

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
  matches: LogMatcher[]  // OPTIONAL; if empty, matches all log records
  rename:  LogRename[]   // OPTIONAL
  add:     LogAdd[]      // OPTIONAL
  remove:  LogRemove[]   // OPTIONAL
  redact:  LogRedact[]   // OPTIONAL
}
```

A policy MUST carry at least one operation.

### Execution Order

A consumer MUST apply the operations in this order and MUST NOT reorder them:

1. **Rename.** Change the field key.
2. **Add.** Insert the field.
3. **Remove.** Delete the field.
4. **Redact.** Mask the field value.

Within each of the four operation stages, operations across all matching
`LogTransformPolicy` rules MUST execute in ascending lexicographical (UTF-8
byte) order of `Policy.id`, and in list order within each policy.

### Mutation Selectors

- `LogTargetSelector` (used by `LogRemove`, `LogRedact`, and `LogAdd`) selects
  `record_field`, `log_attribute`, or `body_field`.
- `LogAttributeSelector` (used by `LogRename.from` and `LogRename.to`) selects
  `log_attribute` or `body_field`.

When a write operation (`LogRename.to` or `LogAdd.target`) targets a
multi-segment `log_attribute` or `body_field` path:

- Missing intermediate segments are created as `KeyValueList` maps (if
  `body_field` is targeted and `LogRecord.body` is unset, `body` is initialized
  as a `KeyValueList` map).
- If an existing intermediate value along the path (or `LogRecord.body` itself
  when targeting `body_field`) is not a `KeyValueList` map, the operation yields
  no change (fail-open).

### Rename

```
LogRename {
  from:   LogAttributeSelector  // REQUIRED
  to:     LogAttributeSelector  // REQUIRED
  upsert: bool                  // OPTIONAL, defaults to false
}
```

A source that is absent yields no change. When `from` and `to` resolve to the
same target, the operation yields no change. When `upsert` is `false` and the
destination already holds a value, the operation yields no change and the source
entry is preserved. When `upsert` is `true`, the consumer moves the value from
`from` to `to`, overwriting any existing value at `to` and removing the source
entry at `from`.

### Add

```
LogAdd {
  target: LogTargetSelector  // REQUIRED
  // source (REQUIRED, exactly one of):
  value:  ScalarValue        // literal scalar value
  upsert: bool               // OPTIONAL, defaults to false
}
```

`LogAdd` wraps `value` in a `source` oneof so future value sources (such as
copying from another field) can be added as new variants without breaking
generated code. An operation with an unset `source` oneof is invalid.

When `upsert` is `false` and the target already holds a value, the operation
yields no change. When `upsert` is `true`, the consumer overwrites the target.

When `target` selects a `record_field`, `value` MUST match the field's data
model type or the operation yields no change (fail-open):

- `LOG_RECORD_FIELD_BODY`: any `ScalarValue` variant (sets `LogRecord.body`).
- `LOG_RECORD_FIELD_SEVERITY_TEXT` and `LOG_RECORD_FIELD_EVENT_NAME`:
  `string_value` only.
- `LOG_RECORD_FIELD_SEVERITY_NUMBER`: `int_value` in the range `1` to `24` only.
- `LOG_RECORD_FIELD_TRACE_ID`: 32-character lowercase hexadecimal `string_value`
  (decoded to 16 bytes).
- `LOG_RECORD_FIELD_SPAN_ID`: 16-character lowercase hexadecimal `string_value`
  (decoded to 8 bytes).

### Remove

```
LogRemove { target: LogTargetSelector }  // REQUIRED
```

A target that is absent yields no change. Removing a `record_field` clears the
field to its default empty value.

### Redact

```
LogRedact {
  target:      LogTargetSelector  // REQUIRED
  // mask (OPTIONAL; defaults to literal "[REDACTED]" when unset):
  replacement: string
  // pattern (OPTIONAL; masks the whole field value when unset):
  regex:       string
}
```

`LogRedact` wraps `replacement` in an optional `mask` oneof and `regex` in an
optional `pattern` oneof so future masking strategies (such as cryptographic
hashing) and pattern matchers (such as built-in PII detectors) can be added as
new variants without breaking generated code.

A target that is absent yields no change.

When `pattern` (`regex`) is unset, the consumer replaces the whole target value
with the string `replacement` (defaulting to `"[REDACTED]"` when `mask` is
unset) on string record fields (`LOG_RECORD_FIELD_SEVERITY_TEXT`,
`LOG_RECORD_FIELD_EVENT_NAME`) and `AnyValue` targets (`LOG_RECORD_FIELD_BODY`,
`log_attribute`, `body_field`). Targeting a non-string typed record field
(`LOG_RECORD_FIELD_SEVERITY_NUMBER`, `LOG_RECORD_FIELD_TRACE_ID`,
`LOG_RECORD_FIELD_SPAN_ID`) yields no change.

When `regex` is set, the consumer evaluates the RE2 expression against the
current string value of the target:

- An expression that does not match yields no change.
- An expression that matches replaces **every** non-overlapping full match, not
  only the first one.
- A capture group supplies text for the template. A capture group MUST NOT widen
  or narrow the replaced range.
- A target value that is not a string (including `LOG_RECORD_FIELD_TRACE_ID`
  and `LOG_RECORD_FIELD_SPAN_ID`) yields no change.

When `regex` is set, `replacement` is a template. A consumer MUST support:

| Syntax           | Expands to                |
| ---------------- | ------------------------- |
| `$0`             | The full match.           |
| `$1` - `$99`     | A numbered capture group. |
| `${1}` - `${99}` | A numbered capture group. |
| `${name}`        | A named capture group.    |
| `$$`             | A literal dollar sign.    |

A reference to an absent capture group MUST expand to the empty string.

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
  to every data point in the metric stream.
- **Data point level.** When any matcher selects `datapoint_attribute`, the
  action applies to each matching data point on its own. A drop prunes the
  matching data points and leaves the rest of the stream in place.

Filter precedence (`ACTION_KEEP` overrides `ACTION_DROP`) resolves per data
point across both instrument-level and data-point-level policies. When no
data-point-level `ACTION_KEEP` policy can match a stream, a consumer MAY
short-circuit and drop the entire stream at the instrument level.

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
  matches:  TraceMatcher[]  // OPTIONAL; if empty, matches all spans
  sampling: SamplingConfig  // REQUIRED
}

SamplingConfig {
  percentage:         double        // REQUIRED, 0 to 100
  mode:               SamplingMode  // OPTIONAL, defaults to SAMPLING_MODE_EQUALIZING
  sampling_precision: uint32        // OPTIONAL, defaults to 4, range 1 to 14
}
```

A consumer compares a 56-bit randomness value R (read from the `rv` sub-key of
the `ot` tracestate entry when present, or else from the least-significant 56
bits of the `trace_id`) against a rejection threshold T, and keeps the span when
R is greater than or equal to T. The percentage sets the threshold:

```
T = (1 - percentage / 100) * 2^56
```

A `percentage` of 0 drops every matching span. A `percentage` of 100 does not
drop any matching spans, although they may be dropped by a different matching
sampling policy. A value outside the range 0 to 100 is invalid.

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
`event_name`, `equals: { string_value: "exception" }`, and `negate: true`
therefore reports true for a span that carries no exception event.

### Sampling Modes

| Mode                         | Description                                                                                                                               |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `SAMPLING_MODE_EQUALIZING`   | Raises every span to one common threshold. A span whose arriving threshold is already more restrictive keeps that threshold. The default. |
| `SAMPLING_MODE_PROPORTIONAL` | Multiplies the arriving probability by `percentage`. Reduces traffic by a fixed factor whatever the arriving threshold.                   |

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
The operations run in the order `rename`, `add`, `remove`, `redact` across the
union of all matching policies. Within each operation stage, operations across
matching policies MUST execute in ascending lexicographical (UTF-8 byte) order
of `Policy.id`, and in list order within each policy's operation list.

This rule set is commutative with respect to policy batch order: the outcome
does not depend on the order in which policies arrive on the wire.

### Match Outcome Semantics

When a consumer tracks policy evaluation and match outcomes for observability or
diagnostics, it SHOULD track both:

1. **Evaluated data (denominator)**: Every telemetry datum (one log record, one
   metric data point, or one span) that enters policy evaluation for a signal,
   before the filter, sampling, and transform stages run. A metric data point is
   the unit for metrics, not a metric stream. This count includes data that are
   subsequently dropped, sampled out, or transformed, as well as data that no
   policy matches, providing the denominator needed to interpret per-policy
   match counts.
2. **Per-policy match outcomes**: For each policy that matches a telemetry
   datum, one of two outcomes under the [precedence](#precedence) rules above:
   - **`hit`**: The final decision for the stage honored the intent of the
     matching policy.
   - **`miss`**: Another matching policy in the same stage overrode the intent
     of the policy.

| Stage & Situation                                      | `hit`                            | `miss`                                |
| ------------------------------------------------------ | -------------------------------- | ------------------------------------- |
| Filter: keep and drop policies match; record is kept.  | Every matching keep policy.      | Every matching drop policy.           |
| Filter: only keep policies match; record is kept.      | Every matching keep policy.      | None.                                 |
| Filter: only drop policies match; record is dropped.   | Every matching drop policy.      | None.                                 |
| Sampling: decision does not drop the span.             | Every matching sampling policy.  | None.                                 |
| Sampling: decision drops the span.                     | The most restrictive policy.     | Every other matching sampling policy. |
| Transform: record survives filter and policy matches.  | Every matching transform policy. | None.                                 |

A transform policy is not evaluated against a record that was dropped in the
filter stage.

How a consumer reports these counts and outcomes is outside the scope of this
document.

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

| Condition                                                        | Example                                            |
| ---------------------------------------------------------------- | -------------------------------------------------- |
| The policy `id` is empty or duplicated within a batch.           | `id: ""`                                           |
| The policy `definition` is unset.                                | an empty `definition` oneof                        |
| A filter policy has an empty `matches` list.                     | `matches: []` on a filter policy                   |
| A matcher sets no target.                                        | an empty `target` oneof                            |
| A matcher sets no predicate.                                     | an empty `predicate` oneof                         |
| A selector names an unspecified enum value.                      | `LOG_RECORD_FIELD_UNSPECIFIED`                     |
| An attribute path is empty.                                      | `log_attribute: []`                                |
| A `regex` predicate or a `redact` pattern is not valid RE2.      | `regex: "([a-z"`                                   |
| A typed value is unset.                                          | an empty `ScalarValue`                             |
| A filter policy has an unset action.                             | `action` absent                                    |
| A sampling policy has an unset `sampling` or `percentage`.       | `percentage` absent                                |
| A sampling configuration is out of range.                        | `percentage: 150`, `sampling_precision: 0`         |
| A transform policy carries no operation.                         | no `rename`, `add`, `remove`, or `redact`          |
| A transform target, `rename` selector, or `add` source is unset. | an empty `target`, `from`, `to`, or `source` oneof |

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

Protocol Buffers (binary and canonical Protobuf JSON) is the wire format, so
consumers (such as SDKs) are NOT required to support YAML. When a policy server,
CLI, or documentation represents a policy in YAML (as in the examples below), the
YAML representation MUST use the [YAML 1.2 Core Schema](https://yaml.org/spec/1.2.2/#103-core-schema)
and map 1:1 onto the canonical Protobuf JSON schema (matching how
[OpenTelemetry Declarative Configuration](https://opentelemetry.io/docs/specs/otel/configuration/data-model/)
maps YAML 1.2 files onto its JSON Schema).

**Drop debug logs from one service.**

```yaml
id: drop-checkout-debug-logs
name: Drop checkout debug logs
log_filter:
  matches:
    - target: { resource_attribute: { path: ["service.name"] } }
      predicate: { equals: { string_value: checkout-api } }
    - target: { record_field: LOG_RECORD_FIELD_SEVERITY_TEXT }
      predicate: { equals: { string_value: DEBUG } }
  action: ACTION_DROP
```

**Always keep error logs, whatever another policy says.**

```yaml
id: keep-error-logs
name: Keep error logs
log_filter:
  matches:
    - target: { record_field: LOG_RECORD_FIELD_SEVERITY_NUMBER }
      predicate: { gte: { int_value: 17 } }
  action: ACTION_KEEP
```

**Redact an authorization header in place.**

```yaml
id: redact-http-auth-header
name: Redact HTTP authorization headers
log_transform:
  matches:
    - target:
        log_attribute:
          path: ["http", "request", "headers", "authorization"]
      predicate: { exists: {} }
  redact:
    - target:
        log_attribute:
          path: ["http", "request", "headers", "authorization"]
      regex: '(?i)^(bearer\s+).+$'
      replacement: "$1[REDACTED]"
```

**Prune healthy data points but keep the metric stream.**

```yaml
id: drop-ok-status-datapoints
name: Drop 200-status data points
metric_filter:
  matches:
    - target: { datapoint_attribute: { path: ["http.response.status_code"] } }
      predicate: { equals: { int_value: 200 } }
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
    - target: { span_attribute: { path: ["http.route"] } }
      predicate: { regex: "^/(healthz|readyz)$" }
  sampling:
    percentage: 0.0
```

**Sample database spans at 5 percent.**

```yaml
id: sample-database-spans
name: Sample database spans at 5 percent
trace_sampling:
  matches:
    - target: { span_attribute: { path: ["db.system.name"] } }
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
4. Runs the transform operations in the order `rename`, `add`, `remove`,
   `redact`, ordered by ascending `Policy.id` within each operation stage.
5. Stays fail-open for every error condition.
6. Honors the `enabled` field.
7. Validates a policy per the [compilation error](#compilation-errors) rules,
   keeps an invalid policy inert, and does not abort a valid policy in the same
   batch.

A consumer MAY support a subset of the policy types. A consumer MUST document
every policy type and every feature it does not support.

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

### The `Policy` envelope is mandatory

**Decision.** Every policy is carried inside the `Policy` envelope (`id`,
`name`, `description`, `enabled`, `labels`, and a `oneof definition` over the
policy types). Bare policy messages without the envelope are not used on the
wire.

**Tradeoff.** A transport such as xDS or OpAMP that already has an outer
resource identifier still carries `Policy.id` inside the payload. In exchange,
consumers only ever decode one canonical envelope type, `enabled` is always
available, and `Policy.id` is guaranteed to exist for deterministic transform
ordering and observability.

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
and `LogAdd` share `LogTargetSelector` and `LogRename` reuses
`LogAttributeSelector` for both `from` and `to` rather than repeating inline
`oneof` definitions across every message.

### The target never carries the expected value

**Decision.** A metric type, an aggregation temporality, a monotonicity flag, a
span kind, and a span status code are all first-class **fields** on the
selector, read by a normal predicate against their canonical uppercase name.

**Tradeoff.** `descriptor_field: TYPE` with
`equals: { string_value: "HISTOGRAM" }` is longer to write than
`metric_type: HISTOGRAM`, and it trades an enum for a string, so a
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

**Decision.** `contains` takes a `ScalarValue`. It tests array membership, string
substring, and bytes subsequence, according to the type of the target.

**Tradeoff.** One name now carries three meanings, which a reader must learn. In
exchange a policy can match an element of an array attribute, which no
string-only form can express, and the predicate set gains no extra variant.

### An attribute path

**Decision.** Every attribute and structured body selector takes an
`AttributePath`.

**Tradeoff.** A path costs a list allocation where a flat string key would not,
and the overwhelming majority of OpenTelemetry attributes are flat keys. A
consumer can specialize the single-segment case, whereas a flat string would
have made a nested map unreachable without a later breaking change.

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

**Decision.** `LogAdd` wraps `ScalarValue value` in `oneof source` rather than
taking a bare string, and `LogRedact` wraps `replacement` in `oneof mask` and
`regex` in `oneof pattern`.

**Tradeoff.** Slightly more to write for the common case of inserting a string,
and one extra `oneof` wrapper in generated code. In exchange, a policy can
insert a boolean or a number without forcing a consumer to guess the intended
type from text, and future `LogAdd` value sources (such as copying from another
field), `LogRedact` masking strategies (such as cryptographic hashing), or
pattern matchers (such as built-in PII detectors) can be added as new `oneof`
variants without a source-breaking change in generated language stubs.

### The transport is out of scope

**Decision.** This document defines the policy schema and its evaluation
semantics. It does not define how a consumer receives a policy set or how it
reports the results.

**Tradeoff.** A conformant consumer still needs a transport binding. Binding the
schema to one transport, whether xDS, OpAMP, or a dedicated sync protocol, would
have blocked the others. The schema is transport-agnostic, so each binding can
land on its own.
<!-- TODO: Link to the policy specification in opentelemetry-specification once it exists. -->

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
| Resource transformation      | A `ResourceTransformPolicy` with optional signal selection.     |
| Metric transformation        | A `MetricTransformPolicy`, reusing `MetricFieldSelector`.       |
| Trace transformation         | A `TraceTransformPolicy`, reusing `TraceFieldSelector`.         |
| Span link matching           | A `link_trace_id` variant on `TraceFieldSelector`.              |
| Metric value thresholds      | A data point value target on `MetricFieldSelector`.             |
| Boolean expression trees     | Out of scope. Write several policies for OR semantics.          |
| Self-observability metrics   | Metric and attribute definitions in `semantic-conventions`.     |
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
