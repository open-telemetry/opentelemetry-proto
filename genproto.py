#!/usr/bin/env python3

import shutil
import os
from os import path
import subprocess
import argparse
import time

def rmtree_retry(dpath):
    if not path.exists(dpath):
        return
    try:
        shutil.rmtree(dpath)
    except OSError:
        time.sleep(1) # For antivirus (?)
        shutil.rmtree(dpath)

def run_protoc(src, lang, outdir):
    return subprocess.run(["protoc", "--" + lang + "_out=" + outdir, src], check=True)

def run_protoc_swagger(src, swagger_plug, outdir):
    basename = os.path.splitext(src)[0]
    return subprocess.run([
        "protoc",
        "--plugin=protoc-gen-swagger=" + swagger_plug,
        "--swagger_out=logtostderr=true,grpc_api_configuration=" + basename + "_http.yaml:" + outdir,
        src
        ], check=True)

PROTOFILES = (
    "opentelemetry/proto/resource/v1/resource.proto",
    "opentelemetry/proto/trace/v1/trace_config.proto",
    "opentelemetry/proto/trace/v1/trace.proto",
    "opentelemetry/proto/metrics/v1/metrics.proto",
    "opentelemetry/proto/agent/common/v1/common.proto",
    "opentelemetry/proto/agent/metrics/v1/metrics_service.proto",
    "opentelemetry/proto/agent/trace/v1/trace_service.proto",
)

OPENAPI_PROTOFILES = (
    "opentelemetry/proto/agent/trace/v1/trace_service.proto",
)

def main():
    parser = argparse.ArgumentParser(description="Generate bindings for protobuf")
    parser.add_argument("--outroot", default="./build",
        help="Root directory use for output (may be cleared)")
    parser.add_argument("--language", "-l", nargs="+", default=["java", "openapi"],
        help="List of languages to generate bindings for ('--LANG_out' option of protoc).")
    parser.add_argument("--swagger-plug", default="/usr/bin/protoc-gen-swagger",
        help="If using openapi as language, the path to the protoc-gen-swagger executable")

    args = parser.parse_args()

    rmtree_retry(args.outroot)

    for lang in args.language:
        outdir = path.join(args.outroot, "gen-" + lang)
        os.makedirs(outdir)
        if lang == "openapi":
            for fname in OPENAPI_PROTOFILES:
                run_protoc_swagger(fname, args.swagger_plug, outdir)
        else:
            for fname in PROTOFILES:
                run_protoc(fname, lang, outdir)

if __name__ == "__main__":
    main()