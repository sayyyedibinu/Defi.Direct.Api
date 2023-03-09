#!/bin/bash
set -e
set -o pipefail
cd defi-direct-ui-new
echo 'cp src/admin/resources/config.prod.json to config.json'
cp -f src/admin/resources/config.prod.json src/admin/resources/config.json
echo 'cp src/client/resources/config.prod.json to config.json'
cp -f src/client/resources/config.prod.json src/client/resources/config.json