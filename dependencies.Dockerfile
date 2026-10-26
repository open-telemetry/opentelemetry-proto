# This is a renovate-friendly source of Docker images.
FROM davidanson/markdownlint-cli2:v0.24.0@sha256:70ead7c0352d22d04bbe612cd96b54ec591538d8f4626cafe391bb2ecf3639ca AS markdownlint
FROM lycheeverse/lychee:sha-3a09227-alpine@sha256:5853bd7c283663a1200dbb15924a5047f8d4c50adfa7a4c212a94f04bbac831c AS lychee
FROM otel/build-protobuf:0.26.0@sha256:ea0af87838dbd1cc5e00ce681f1db7345e2594668bebd52ae5e96d2575cbbb5c AS build-protobuf
FROM bufbuild/buf:1.74.0@sha256:621f108266b19236906aa328e64b7c50340738472c5da4d4b25104f01aa8d204 AS bufbuild
