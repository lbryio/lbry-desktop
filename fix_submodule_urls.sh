#!/bin/bash

# https://github.com/lbryio/lbry-app/commit/4386102ba3bf8c731a075797756111d73c31a47a
# https://github.com/lbryio/lbry-app/commit/a3a376922298b94615f7514ca59988b73a522f7f

# Appveyor and Teamcity struggle with SSH urls in submodules, so we use HTTPS
# But locally, SSH urls are way better since they dont require a password

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "DIR"

git config submodule.lbry.url git@github.com:lbryio/lbry.git
git config submodule.lbryum.url git@github.com:lbryio/lbryum.git
