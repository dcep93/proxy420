#!/bin/bash

set -euo pipefail

filename=recorded_sha.txt

cd app
test -f "$filename"
printf "<pre>%s\n%s\n</pre>\n" "$(TZ='America/Los_Angeles' date)" "$(git log -1)" > "$filename"
