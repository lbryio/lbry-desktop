#!/bin/bash

# $> versionAndTag v0.12.34-sdjljsd
ver=\"$1\"
yarn version $ver

git add --all

git commit -m $ver

commit=`git rev-parse HEAD`
echo $commit

git tag -a $ver -m $ver $commit
