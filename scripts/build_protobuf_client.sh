#!/bin/bash


PROTO_DIR_PATH=./proto
PROTO_PATH=${PROTO_DIR_PATH}/*.proto

DIST_PATH=./src/grpc/pb

mkdir -p ${DIST_PATH}

# JavaScript code generation
yarn run grpc_tools_node_protoc \
    --js_out=import_style=commonjs,binary:${DIST_PATH} \
    --grpc_out=${DIST_PATH} \
    --plugin=protoc-gen-grpc=./node_modules/.bin/grpc_tools_node_protoc_plugin \
    -I${PROTO_DIR_PATH} \
    ${PROTO_PATH}


# TypeScript code generation
yarn run grpc_tools_node_protoc \
    --plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
    --ts_out=${DIST_PATH} \
    -I${PROTO_DIR_PATH} \
    ${PROTO_PATH}