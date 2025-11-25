# This is a renovate-friendly source of Docker images.
FROM davidanson/markdownlint-cli2:v0.19.1@sha256:502fcf316d575d1e663005c8d57688e5bda316f3996caa5715aa384fa1d34810 AS markdownlint
FROM lycheeverse/lychee:sha-3a09227-alpine@sha256:5853bd7c283663a1200dbb15924a5047f8d4c50adfa7a4c212a94f04bbac831c AS lychee
