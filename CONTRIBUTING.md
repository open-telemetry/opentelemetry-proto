# Contributing

Read OpenTelemetry project [contributing
guide](https://github.com/open-telemetry/community/blob/main/CONTRIBUTING.md)
for general information about the project.

## Prerequisites

- `Docker`

## Making changes to the .proto files

After making any changes to .proto files make sure to generate all
implementation by running `make gen-all`.

## Profiles Compatibility Requirements

The Otel profile format in
[profiles/v1experimental](opentelemetry/proto/profiles/v1experimental)
is derived from
[pprof](https://github.com/google/pprof/tree/main/proto) and is currently
in experimental state. We would like to continue maintaining compatibility with pprof.
All changes to profile proto should meet the following compatibility criteria:

- Every valid pprof profile is also a valid Otel profile AND,
- Every Otel profile is a valid pprof profile, after any new fields introduced in
  Otel profile are discarded.
