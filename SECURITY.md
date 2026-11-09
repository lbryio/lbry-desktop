# Security Policy

## Reporting a vulnerability

Please don't report security problems in public issues, pull requests or discussions.

Report them privately through this repository's
[Security tab](https://github.com/bitcoinbrisbane/lbry-desktop/security/advisories/new)
(**Report a vulnerability**). Only the maintainers can see the report.

It helps to include:

- what an attacker can do, and what they need first (a malicious claim, a link the user opens, local access, ...)
- steps or a proof of concept that reproduce it
- the version or commit you tested, and your operating system

This fork is maintained by volunteers, so a reply can take a few days. We'll keep you updated while we work
on a fix, and credit you in the advisory unless you'd rather we didn't.

## Supported versions

This fork has no releases of its own yet. Fixes go to `master`.

The last official LBRY release, v0.53.9, is no longer maintained by LBRY Inc. If a problem affects it,
report it here and we'll check whether it also affects `master`.

## Scope

This repository is the desktop app: the Electron shell and the React UI. Problems in these belong to
other projects, so please report them there:

- the LBRY SDK (`lbrynet`) the app runs: [lbryio/lbry-sdk](https://github.com/lbryio/lbry-sdk)
- the LBRY blockchain node: [lbryio/lbcd](https://github.com/lbryio/lbcd)
- Odysee's websites and services

If you're not sure where something belongs, report it here and we'll pass it on.
