# Contributing

## Introduction

Welcome, and thank you for your interest in contributing to OpenTelemetry's Protobuf definitions! Your contributions — big or small — are invaluable in shaping and improving this essential part of the OpenTelemetry ecosystem.

Whether you are fixing a small issue, updating documentation, or introducing a major improvement, we appreciate your efforts.
If you're new to the project, don't hesitate to ask questions and seek guidance from the community.
We are here to support you!

Before contributing, we encourage you to read the OpenTelemetry project [contributing
guide](https://github.com/open-telemetry/community/blob/main/guides/contributor/README.md)
for general information about the project.

## Prerequisites

- `Docker`

## Making Changes to the .proto Files

When proposing schema changes or additions:

1. Ensure all new messages, enums, enum values, and fields include a `// [Since next]` annotation in their leading doc comment (see [Version Annotations](#version-annotations-since-labels)).
2. Follow the [Schema Evolution and Compatibility](#schema-evolution-and-compatibility) and [Style Guide](#style-guide) rules.
3. Run `make gen-all` to regenerate implementation stubs across all supported target languages.
4. Validate schema linting and backward compatibility before opening a pull request:

   ```bash
   make check
   ```

## Schema Evolution and Compatibility

OpenTelemetry protocol definitions are the foundation of the OTLP ecosystem and demand strict backward compatibility (see [docs/specification.md#future-versions-and-interoperability](docs/specification.md#future-versions-and-interoperability)):

- **Preserve Field Numbers and Types**: Never change the field tag number or data type of an existing field.
- **Deprecation over Deletion**: Never delete active fields. Mark obsolete fields with `[deprecated = true]`, or explicitly reserve removed field numbers and names using `reserved N;` and `reserved "field_name";`.
- **Enum Defaults and Unspecified Values**: The zero value of an enum MUST represent the default or unspecified state (`<ENUM_NAME>_UNSPECIFIED = 0;`).
- **Experimental vs Stable Packages**: New experimental signals and capabilities MUST reside in a `v1development` package (e.g. `profiles/v1development`, `processcontext/v1development`) until they reach maturity and are promoted to `v1`.

## Style Guide

OpenTelemetry follows the [Protobuf style guide](https://protobuf.dev/programming-guides/style/) with the following clarifications:

### Naming Conventions

- **Fields**: Use `snake_case` (e.g. `trace_id`, `dropped_attributes_count`).
- **Messages & Enums**: Use `PascalCase` (e.g. `ResourceMetrics`, `SpanFlags`).
- **Enum Values**: Use `UPPER_SNAKE_CASE` prefixed with the enum name (e.g. `SPAN_FLAGS_TRACE_FLAGS_MASK`).
- **Service RPCs**: Use `PascalCase` for RPC methods (e.g. `Export`).

### Documentation Comments

- All messages, enums, enum values, and fields MUST be documented via comments.
- Field comments should document purpose or behavior with active verbs, or a simple definition noun phrase (similar to a dictionary entry).
  - valid: "Represents ..."
    valid: "Additional attributes that describe the scope."
  - not-valid: "used to represent..."
- Message and field comments may reference the field or message by name.
  - valid: "AnyValue ..."
  - valid: "The value ..."

### Version Annotations ("Since" Labels)

To assist downstream OTLP implementors in identifying when schema capabilities were introduced post v1.0, any element added MUST include a `[Since ...]` annotation in its doc comment (see [docs/specification.md#future-versions-and-interoperability](docs/specification.md#future-versions-and-interoperability)):

Prior to release - use the placeholder `// [Since next]`. During the release process, maintainers will automatically convert this placeholder to the released version tag (e.g. `// [Since v1.11.0]`).

Place the annotation on its own line within or directly below the element's doc comment block. Example:

```protobuf
// Additional metadata attributes that describe the metric. [Optional].
//
// [Since next]
repeated opentelemetry.proto.common.v1.KeyValue metadata = 12;
```

## Further Help

If you have any questions or need assistance while contributing, feel free to reach out to the [`#otel-specification`](https://cloud-native.slack.com/archives/C01N7PP1THC) channel on the [CNCF Slack](https://slack.cncf.io/).
View meeting notes of previous SIG calls in this [google doc](https://docs.google.com/spreadsheets/d/1SYKfjYhZdm2Wh2Cl6KVQalKg_m4NhTPZqq-8SzEVO6s/edit?gid=0#gid=0) as stated [here](https://github.com/open-telemetry/community/?tab=readme-ov-file#governing-bodies) to stay up to date.

Also see the [specification](https://github.com/open-telemetry/opentelemetry-specification?tab=readme-ov-file#questions) repo for more info. Thank you.
