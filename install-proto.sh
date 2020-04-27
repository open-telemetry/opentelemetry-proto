#!/usr/bin/env bash

set -e

readonly GRPC_ECOSYSTEM_VER="v1.9.6"
readonly GRPC_ECOSYSTEM_URL="https://github.com/grpc-ecosystem/grpc-gateway/releases/download/${GRPC_ECOSYSTEM_VER}"

readonly PROTOC_GEN_SWAGGER_BIN="protoc-gen-swagger-${GRPC_ECOSYSTEM_VER}-linux-$( uname -m )"
readonly PROTOC_GEN_SWAGGER_URL="${GRPC_ECOSYSTEM_URL}/${PROTOC_GEN_SWAGGER_BIN}"

readonly PROTOC_GEN_GRPC_GATEWAY_BIN="protoc-gen-grpc-gateway-${GRPC_ECOSYSTEM_VER}-linux-$( uname -m )"
readonly PROTOC_GEN_GRPC_GATEWAY_URL="${GRPC_ECOSYSTEM_URL}/${PROTOC_GEN_GRPC_GATEWAY_BIN}"

readonly PROTOC_VER="3.9.1"
readonly PROTOC_ZIP="protoc-${PROTOC_VER}-linux-$( uname -m ).zip"
readonly PROTOC_URL="https://github.com/protocolbuffers/protobuf/releases/download/v${PROTOC_VER}/$PROTOC_ZIP"

readonly PROTOC_GEN_GO_VER="v1.3.2"
readonly PROTOC_GEN_GO_URL="github.com/golang/protobuf/protoc-gen-go"

readonly DEFAULT_DEST="/usr/local"

get() {
    local url="$1"
    local dest="$2"

    if [[ -w $dest ]]
    then
        wget --quiet "$url" -O "$dest"
    else
        sudo wget --quiet "$url" -O "$dest"
    fi
}

install_bin() {
    local dest_dir="${1}/bin"
    local source_bin="$2"
    local source_url="$3"
    local target_bin="$4"
    local auth

    if [[ ! -w $dest_dir ]]
    then
        auth="sudo"
    fi

    [ -d "${dest_dir}" ] || $auth mkdir -p "${dest_dir}"

    get "$source_url" "${dest_dir}/$source_bin"
    $auth chmod +x "${dest_dir}/$source_bin"
    $auth ln -s -f "${dest_dir}/${source_bin}" "${dest_dir}/$target_bin"

    echo "installed $source_bin to ${dest_dir}/${target_bin}"
}

install_protoc_gen_swagger() {
    local dest="$1"

    install_bin \
        "$dest"\
        "$PROTOC_GEN_SWAGGER_BIN"\
        "$PROTOC_GEN_SWAGGER_URL"\
        "protoc-gen-swagger"
}

install_protoc_gen_grpc_gateway() {
    local dest="$1"

    install_bin \
        "$dest"\
        "$PROTOC_GEN_GRPC_GATEWAY_BIN"\
        "$PROTOC_GEN_GRPC_GATEWAY_URL"\
        "protoc-gen-grpc-gateway"
}

install_protoc() {
    local dest="$1"
    local output="${dest}/protoc-${PROTOC_VER}"
    local tmpfile auth

    tmpfile="$( mktemp )"
    get "$PROTOC_URL" "$tmpfile"

    if [[ ! -w $dest ]]
    then
        auth="sudo"
    fi

    $auth unzip -qq -o -d "$output" "$tmpfile"
    rm -rf "$tmpfile"
    [ -d "${dest}/bin" ] || $auth mkdir "${dest}/bin"
    $auth ln -s -f "${output}/bin/protoc"  "${dest}/bin/protoc"

    echo "installed protoc v$PROTOC_VER to ${dest}/bin/protoc"
}

install_protoc_gen_go() {
    local dest

    if [[ ! -d "$( go env GOPATH )/src/$PROTOC_GEN_GO_URL" ]]
    then
        go get -d -u "$PROTOC_GEN_GO_URL"
    fi
    git -C "$( go env GOPATH )/src/$PROTOC_GEN_GO_URL" checkout --quiet "$PROTOC_GEN_GO_VER"
    go install "$PROTOC_GEN_GO_URL"

    dest=$( go env GOBIN )
    dest=${dest:-$( go env GOPATH )/bin}
    echo "installed protoc-gen-go $PROTOC_GEN_GO_VER to $dest/protoc-gen-go"
}

main() {
    local dest="${1:-$DEFAULT_DEST}"

    install_protoc_gen_swagger "$dest"
    install_protoc_gen_grpc_gateway "$dest"
    install_protoc "$dest"
    install_protoc_gen_go
}

main "$@"
