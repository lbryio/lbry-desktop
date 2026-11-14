#!/bin/bash
set -e

# Chromium's SUID sandbox fallback needs these permissions.
chown root:root '/opt/LBRY/chrome-sandbox' || true
chmod 4755 '/opt/LBRY/chrome-sandbox' || true

# Ubuntu 23.10+ restricts unprivileged user namespaces via AppArmor; install
# a profile so the Chromium sandbox works without the SUID fallback (#660).
if [ -d /etc/apparmor.d ]; then
  cp /opt/LBRY/resources/apparmor-lbry /etc/apparmor.d/lbry 2>/dev/null || true
  if command -v apparmor_parser >/dev/null 2>&1; then
    apparmor_parser -r /etc/apparmor.d/lbry 2>/dev/null || true
  fi
fi
