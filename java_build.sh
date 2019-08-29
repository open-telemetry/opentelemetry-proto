#!/usr/bin/env bash

set -e

OUTDIR="./build/gen-java"
rm -rf $OUTDIR
mkdir -p $OUTDIR

protoc --java_out=${OUTDIR} opentelemetry/proto/resource/v1/resource.proto \
    && protoc --java_out=${OUTDIR} opentelemetry/proto/trace/v1/trace_config.proto \
    && protoc --proto_path=./ --java_out=${OUTDIR} opentelemetry/proto/trace/v1/trace.proto \
    && protoc --proto_path=./ --java_out=${OUTDIR} opentelemetry/proto/metrics/v1/metrics.proto \
    && protoc --proto_path=./ --java_out=${OUTDIR} opentelemetry/proto/agent/common/v1/common.proto \
    && protoc --proto_path=./ --java_out=${OUTDIR} opentelemetry/proto/agent/metrics/v1/metrics_service.proto \
    && protoc --proto_path=./ --java_out=${OUTDIR} opentelemetry/proto/agent/trace/v1/trace_service.proto

OPENAPI_OUTDIR="./build/gen-openapi"

mkdir -p $OPENAPI_OUTDIR
protoc --plugin=protoc-gen-swagger=/usr/bin/protoc-gen-swagger --swagger_out=logtostderr=true,grpc_api_configuration=opentelemetry/proto/agent/trace/v1/trace_service_http.yaml:$OPENAPI_OUTDIR opentelemetry/proto/agent/trace/v1/trace_service.proto
