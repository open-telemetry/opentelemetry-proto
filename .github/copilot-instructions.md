# OpenTelemetry Proto Repository Instructions

First-pass PR review rules for OpenTelemetry Protobuf definitions.
**Prefer silence over uncertainty.** Only flag substantive issues on changed lines.
Skip stylistic preferences not listed in the guidelines. Do not nitpick.

Do not flag anything CI will catch (compilation errors, `buf lint` issues, `buf breaking` violations, or code formatting).

When flagging issues, cite the relevant rule and link to [CONTRIBUTING.md](../CONTRIBUTING.md).

## [Versioning] "Since" Annotations
Ensure all newly added messages, enums, enum values, fields, and RPCs include a `// [Since next]` comment annotation per [CONTRIBUTING.md#version-annotations-since-labels](../CONTRIBUTING.md#version-annotations-since-labels).

## [Documentation] Explanatory Comments
Ensure messages and fields have clear, meaningful doc comments written with active verbs or dictionary noun phrases per [CONTRIBUTING.md#documentation-comments](../CONTRIBUTING.md#documentation-comments).

## [Naming] Protobuf Conventions
Ensure all newly defined identifiers align with [CONTRIBUTING.md#naming-conventions](../CONTRIBUTING.md#naming-conventions).

## [Schema Design] Evolution & Package Placement
Ensure new experimental signals and capabilities reside in `v1development` packages and follow [CONTRIBUTING.md#schema-evolution-and-compatibility](../CONTRIBUTING.md#schema-evolution-and-compatibility).
