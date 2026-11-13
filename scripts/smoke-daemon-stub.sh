#!/bin/sh
# Stand-in for lbrynet in the CI smoke test (#668). The app starts the binary named by LBRY_DAEMON and
# treats it exiting as a fatal "Daemon has Exited"; this one just stays alive and answers nothing, so
# the smoke test checks the renderer without needing the real daemon or the network.
exec sleep 100000
