# This is a renovate-friendly source of Docker images.
FROM davidanson/markdownlint-cli2:v0.24.1@sha256:caf0698eaea0268bcf35b5e2d7ba946b5899d323e765bc2862054405658cd948 AS markdownlint
FROM lycheeverse/lychee:sha-3a09227-alpine@sha256:5853bd7c283663a1200dbb15924a5047f8d4c50adfa7a4c212a94f04bbac831c AS lychee
FROM otel/build-protobuf:0.26.0@sha256:ea0af87838dbd1cc5e00ce681f1db7345e2594668bebd52ae5e96d2575cbbb5c AS build-protobuf
FROM bufbuild/buf:1.75.0@sha256:adf82c7170be6629ec81dc907921ac1699407cd11c4f7fd7521b13c74152f849 AS bufbuild
