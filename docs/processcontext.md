# Process Context

**Status:** [Development](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/document-status.md)

ProcessContext is a non-OTLP protocol for sharing process-level OpenTelemetry
resource attributes with external readers (e.g. the
[OpenTelemetry eBPF Profiler](https://github.com/open-telemetry/opentelemetry-ebpf-profiler)).

This page is a quick orientation; the normative specification lives in
[OTEP 4719][otep].

## Relationship to OTLP

ProcessContext is **not** part of OTLP:

- It is not exchanged via gRPC or HTTP.
- It does not pass through the OpenTelemetry Collector.
- It carries only process-scoped resource attributes, not telemetry data.

It lives in this repository because it shares OTLP's `common` and `resource`
proto types and benefits from the same versioning and release machinery.

[otep]: https://github.com/open-telemetry/opentelemetry-specification/blob/main/oteps/profiles/4719-process-ctx.md
