#! /usr/bin/env bash

ROOT_DIR="$(cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd)"
TO_RUN="./node_modules/.bin/ts-node ./scripts/createMonitor.ts $(echo $@)"

echo "Go to dir: $ROOT_DIR"
echo "Executing: ${TO_RUN}"

${TO_RUN}
