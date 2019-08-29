#!/usr/bin/env bash

set -e

DIR="${DIR:-/tmp}"
cd ${DIR}

wget https://github.com/grpc-ecosystem/grpc-gateway/releases/download/v1.9.6/protoc-gen-swagger-v1.9.6-linux-x86_64 \
    && chmod +x protoc-gen-swagger-v1.9.6-linux-x86_64 \
    && sudo ln -s ${DIR}/protoc-gen-swagger-v1.9.6-linux-x86_64 /usr/bin/protoc-gen-swagger

wget https://github.com/protocolbuffers/protobuf/releases/download/v3.9.1/protoc-3.9.1-linux-x86_64.zip \
    && unzip protoc-3.9.1-linux-x86_64.zip \
    && sudo ln -s ${DIR}/bin/protoc /usr/bin/protoc
