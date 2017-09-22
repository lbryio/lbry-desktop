#!/bin/bash
# this is here because teamcity runs /build.sh to build the project
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
$DIR/build/build.sh
