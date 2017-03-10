#!/bin/bash

set -euxo pipefail

ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
cd "$ROOT"

(
  cd lbry
  git tag -d $(git describe)
  git reset --hard origin/master
)

(
  cd lbryum
  git tag -d $(git describe)
  git reset --hard origin/master
)

git tag -d $(git describe)
git reset --hard HEAD~1
