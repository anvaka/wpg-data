#!/usr/bin/env zsh
cd "$(dirname "$0")"
node collect.js && node collect usa
#&& git add . && git commit -m 'updated data' && git push
