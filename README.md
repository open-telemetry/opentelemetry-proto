# Language Independent Interface Types For OpenTelemetry

[![Build Check](https://github.com/open-telemetry/opentelemetry-proto/workflows/Build%20Check/badge.svg?branch=main)](https://github.com/open-telemetry/opentelemetry-proto/actions?query=workflow%3A%22Build+Check%22+branch%3Amain)

The proto files can be consumed as GIT submodules or copied and built directly in the consumer project.

The compiled files are published to central repositories (Maven, ...) from OpenTelemetry client libraries.

See [contribution guidelines](CONTRIBUTING.md) if you would like to make any changes.

## Generate gRPC Client Libraries

To generate the raw gRPC client libraries, use `make gen-${LANGUAGE}`. Currently supported languages are:

* cpp
* csharp
* go
* java
* objc
* openapi (swagger)
* php
* python
* ruby

## Maturity Level

Component                            | Maturity |
-------------------------------------|----------|
**Binary Protobuf Encoding**         |          |
common/*                             | Stable   |
metrics/\*<br>collector/metrics/*    | Stable   |
resource/*                           | Stable   |
trace/trace.proto<br>collector/trace/* | Stable   |
trace/trace_config.proto             | Alpha    |
logs/\*<br>collector/logs/*          | Stable   |
**JSON encoding**                    |          |
All messages                         | Alpha    |

(See [maturity-matrix.yaml](https://github.com/open-telemetry/community/blob/47813530864b9fe5a5146f466a58bd2bb94edc72/maturity-matrix.yaml#L57)
for definition of maturity levels).

## Stability Definition

Components marked `Stable` provide the following guarantees:

- Field types will not change.
- Field numbers will not change.
- Numbers assigned to enum choices will not change.
- Service names and service package names will not change.
- Service operation names, parameter and return types will not change.

The following changes are allowed:

- Message names may change.
- Field names may change.
- Enum names may change.
- Enum choice names may change.
- The location of messages and enums, i.e. whether they are declared at the top
  lexical scope or nested inside another message may change.
- Package names may change.
- Directory structure, location and the name of the files may change.

Note that none of the above allowed changes affects the binary wire representation.

No guarantees are provided whatsoever about the stability of the code that
is generated from the .proto files by any particular code generator.

In the future when OTLP/JSON is declared stable, several of the changes that
are currently allowed will become disallowed since they are visible on the wire
for JSON encoding.

## Experiments

In some cases we are trying to experiment with different features. In this case,
we recommend using an "experimental" sub-directory instead of adding them to any
protocol version. These protocols should not be used, except for
development/testing purposes.

Another review must be conducted for experimental protocols to join the main project.
