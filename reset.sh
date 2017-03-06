#! /bin/bash

set -eu -o xtrace

pushd lbry
git tag -d $(git describe)
git reset --hard origin/master
popd

pushd lbry-web-ui
git tag -d $(git describe)
git reset --hard origin/development
popd

pushd lbryum
git tag -d $(git describe)
git reset --hard origin/master
popd

git tag -d $(git describe)
git reset --hard HEAD~1
