#!/bin/bash

# this is a script instead of a line in the travis.yml
# getting the quoting on this correctly inside the yaml is
# unreadable and difficult

echo '{"sha": "'${TRAVIS_COMMIT}'"}'
