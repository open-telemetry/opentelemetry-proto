# This is a renovate-friendly source of Docker images.
FROM davidanson/markdownlint-cli2:v0.20.0@sha256:8f7487027e6786a583da1c8be8b0541bbd17582a4b8fbe3e27a29d9f29fa77d0 AS markdownlint
FROM lycheeverse/lychee:sha-3a09227-alpine@sha256:5853bd7c283663a1200dbb15924a5047f8d4c50adfa7a4c212a94f04bbac831c AS lychee
