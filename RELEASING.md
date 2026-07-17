# How to Create a Release

_Instruction for Maintainers only._

- Prepare the release by updating [CHANGELOG.md](CHANGELOG.md), see for example
[this PR](https://github.com/open-telemetry/opentelemetry-proto/pull/537).
Merge the PR. From this point on no new PRs can be merged until the release is complete.

- Go to Github [release page](https://github.com/open-telemetry/opentelemetry-proto/releases),
click `Draft a new release`.

- Click "Choose a tag" and specify the next version number. The Target branch should be "main".

- Click "Generate release notes" to get a draft release note. Remove editorial
changes from the notes and any other changes that you don't want in the release notes.
In addition, you can refer to [CHANGELOG.md](CHANGELOG.md) for a list of major changes since last release.

- Click "Publish Release".

Our tags follow the naming convention of `v1.<minor>.<patch>`. Increment `minor` by 1
and use `patch` value of 0 for new minor version releases. For patch releases keep `minor`
unchanged and increment the `patch`.

## Bazel Central Registry (BCR) Publishing

- `opentelemetry-proto` provides minimal Bazel support consisting only of `proto_library` definitions and automated BCR pull request generation upon release.
- When a GitHub release is published, the `.github/workflows/publish-to-bcr.yml` workflow automatically runs and submits a Pull Request to the [Bazel Central Registry](https://github.com/bazelbuild/bazel-central-registry) containing the updated `MODULE.bazel` entry.
- Language-specific rules or bindings (`cc_proto_library`, `go_proto_library`, etc.) are maintained by the BCR community via overlays rather than in this repository.
- Failures in this process do not constitute a release failure. The BCR
  community is responsible for keeping the opentelemetry-proto module
  working and up-to-date in BCR.  This workflow is a convenience for them.
