# This is a renovate-friendly source of Docker images.
FROM davidanson/markdownlint-cli2:v0.22.0@sha256:ea33f1f6a0f062f88a3dddfc49f6d6b5621648a93a0ff49a58bf8ac5a15330b9 AS markdownlint
FROM lycheeverse/lychee:sha-3a09227-alpine@sha256:5853bd7c283663a1200dbb15924a5047f8d4c50adfa7a4c212a94f04bbac831c AS lychee
