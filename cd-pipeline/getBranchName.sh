#!/bin/bash
set -e
set -o pipefail

branchNameScrubbed=$(echo "$BRANCH_NAME" | tr '[:upper:]' '[:lower:]' | sed 's/[_,.]/-/g')

echo "$branchNameScrubbed"