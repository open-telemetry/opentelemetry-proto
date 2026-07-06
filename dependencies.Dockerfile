# This is a renovate-friendly source of Docker images.
FROM davidanson/markdownlint-cli2:v0.23.0@sha256:97996d59837fa7cc27fc5f0e16d72eae71d0cefee15c437ee1d7cdbccb5552be AS markdownlint
FROM lycheeverse/lychee:sha-3a09227-alpine@sha256:5853bd7c283663a1200dbb15924a5047f8d4c50adfa7a4c212a94f04bbac831c AS lychee
