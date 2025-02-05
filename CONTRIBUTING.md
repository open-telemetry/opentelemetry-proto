# Contributing to OpenTelemetry Protocol (OTLP) Specification

## Introduction

Welcome to the OpenTelemetry Protocol (OTLP) Specification repository! 🎉

Thank you for your interest in contributing to this project. This repository contains the OTLP specification and the corresponding Language Independent Interface Types (`.proto` files). Your contributions help improve the interoperability of OpenTelemetry clients across various programming languages.

If you have any questions, feel free to ask in the community channels. We're happy to help! 😊

## Prerequisites

Before getting started, ensure you have the following installed:

- **Docker** – [Install Docker](https://docs.docker.com/engine/install/)
- **Make** (for running development tasks)
- **Protobuf Compiler (protoc)** – [Install protoc](https://grpc.io/docs/protoc-installation/)

Additional Notes:
- Ensure your environment supports the required dependencies for building and testing .proto files.
- Windows users may need [Git Bash](https://gitforwindows.org/) for better compatibility.

## Workflow

We follow a structured workflow to ensure smooth collaboration:

### Commit Message Format

- Use descriptive commit messages (e.g., `fix(proto): resolve issue with trace spec`)
- Follow [Conventional Commits](https://www.conventionalcommits.org/) where possible.

### Pull Request Guidelines

- Fork the repository and create a new branch.
- Follow the coding guidelines before submitting your PR.
- Ensure tests pass locally before pushing.
- Link relevant issues in the PR description.

---

## Local Setup & Development

To set up your local development environment:

```bash
# Clone the repository
git clone https://github.com/open-telemetry/opentelemetry-proto.git
cd opentelemetry-proto

# Generate all implementations
make gen-all
```

To validate your changes:
```bash
make check
```

To update dependencies:
```bash
make update
```

---

## Testing

To test your changes, run:

```bash
make test
```

To verify the protobuf definitions:
```bash
make proto-lint
```

To check compatibility with different OpenTelemetry client libraries:
```bash
make compatibility-test
```

---

## Contributing Rules

- Follow OpenTelemetry’s [Contribution Guidelines](https://opentelemetry.io/docs/contributing/style-guide/).
- Ensure that `.proto` files adhere to OpenTelemetry's stability guarantees.
- Include clear and concise documentation updates if needed.

Check for issues labeled [`good first issue`](https://github.com/open-telemetry/opentelemetry-proto/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) to start contributing.

---

## Further Help

Need help? Join our community:

- **Slack**: [OpenTelemetry Slack](https://opentelemetry.io/community/)
- **Issues**: If you encounter a bug, [open an issue](https://github.com/open-telemetry/opentelemetry-proto/issues)

---

## Troubleshooting Guide

### Common Issues & Fixes

#### 1. Protobuf Compiler Issues
**Error:** `protoc: command not found`

**Fix:** Install the protobuf compiler:
```bash
sudo apt install protobuf-compiler  # Linux
brew install protobuf  # macOS
```

#### 2. Build Failures
**Error:** `Failed to generate gRPC client libraries`

**Fix:** Ensure Docker is running and retry:
```bash
make clean && make gen-all
```

#### 3. Linting Errors
**Error:** `proto-lint: some files do not conform to style guidelines`

**Fix:** Run:
```bash
make proto-lint-fix
```

---

## Additional Information

### Stability Guidelines

This repository follows OpenTelemetry’s stability guarantees:
- Stable components will not introduce breaking changes.
- Development components may be removed or changed without prior notice.

Refer to the [Versioning and Stability](https://github.com/open-telemetry/opentelemetry-proto/blob/main/README.md#versioning-and-stability) documentation for more details.

### Generating gRPC Client Libraries

To generate raw gRPC client libraries for supported languages, run:

```bash
make gen-<language>
```

Currently supported languages:
- cpp
- csharp
- go
- java
- objc
- openapi (swagger)
- php
- python
- ruby

Thank you for contributing! 🚀
