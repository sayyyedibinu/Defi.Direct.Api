#!/bin/bash
set -e
set -o pipefail
cd defi-direct-ui-new
echo 'npm install'
yarn
echo 'yarn run build'
yarn run build
echo 'cp default.conf'
cp src/default.conf build/default.conf