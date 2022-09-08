#!/bin/bash

set -euo pipefail

filename=recorded_sha.txt

cd app
test -f "$filename"
printf "%s\n%s\n" "$(TZ='America/Los_Angeles' date)" "$(git log -1)" > "$filename"
