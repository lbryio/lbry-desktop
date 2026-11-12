# Roadmap

Where LBRY Desktop development is heading under this fork. Dates are intents, not promises;
everything lands through reviewed PRs with green CI. Issues and milestones are the source of
truth — this page is the map.

## Shipped

- **v1.0.0** (November 2026) — the first release since 0.53.9 (February 2023):
  - Entire codebase migrated from Flow to **TypeScript** (~80k lines, [#618](https://github.com/bitcoinbrisbane/lbry-desktop/issues/618))
  - **Electron 17 → 45**, `@electron/remote` removed, electron-builder 26 (community PRs by
    [@elderengineer](https://github.com/elderengineer))
  - **Node 22**, CI green on Linux/macOS/Windows, dedicated typecheck gate, first test suite
  - Thumbnail uploads working again (Odysee image service), follows export/import, window-state
    fixes, full-screen setting, wallet seed phrase reveal/import, choice of search server
    (Lighthouse or self-hosted [lbry-search](https://github.com/bitcoinbrisbane/lbry-search))

## Next releases

### [1.0.1](https://github.com/bitcoinbrisbane/lbry-desktop/milestone/1) — bug-fix patch
Community-reported fixes, all merged: publish-form name overwrites, shutdown crash,
share-link timestamps, explicit splash errors, compact comment box. Remaining: double-quote
lint style ([#626](https://github.com/bitcoinbrisbane/lbry-desktop/issues/626)), more unit
tests ([#634](https://github.com/bitcoinbrisbane/lbry-desktop/issues/634)).

### [1.0.2](https://github.com/bitcoinbrisbane/lbry-desktop/milestone/2) — Electron 45 era
- **Apple Silicon (arm64/universal) macOS builds** ([#514](https://github.com/bitcoinbrisbane/lbry-desktop/issues/514))
- **Signed releases** ([#576](https://github.com/bitcoinbrisbane/lbry-desktop/issues/576))
- Small UX fixes (analytics opt-out guard, Open in Folder, thumbnail flicker, image-upload
  reset, Add Email button) — in review

## Ongoing tracks

- **TypeScript migration, Phases 3–4** ([#618](https://github.com/bitcoinbrisbane/lbry-desktop/issues/618)):
  ESLint 10 + typescript-eslint, remove Flow and `flow-typed/` entirely, prettier 3 with the
  quote flip; then ratchet: burn down the ~1,500 tagged `@ts-expect-error` suppressions and
  ~460 `@ts-nocheck` files, enable strict flags starting with `strictNullChecks`.
- **Dependency modernization** ([#628](https://github.com/bitcoinbrisbane/lbry-desktop/issues/628)):
  Electron epic is done; next epics in order — React 16 → 18/19 (with reakit → ariakit,
  fast-refresh), Redux stack, react-router 7, video.js 10, remark 15, codemirror 6. Safe bumps
  and dead-package removal batches in between.
- **Testing** ([#634](https://github.com/bitcoinbrisbane/lbry-desktop/issues/634)): grow the
  suite (85 tests today) — `lbryURI` is the highest-value target; regression guards accompany
  every bug fix.
- **Wallet**: seed phrase import/export shipped ([#639](https://github.com/bitcoinbrisbane/lbry-desktop/issues/639));
  next, buying LBC in-app via a Uniswap pool with an ETH account derived from the same seed
  ([#640](https://github.com/bitcoinbrisbane/lbry-desktop/issues/640)).
- **Infrastructure**: lbcd work (block-file pruning, claim trie memory), lbry-search as a
  self-hosted Lighthouse alternative.

## Upstream

Our strong preference is for this work to live in **lbryio/lbry-desktop** and for releases to
go out under it, to avoid community confusion. Everything here is offered upstream
([lbryio#7801](https://github.com/lbryio/lbry-desktop/pull/7801)); fixes to issues reported on
the original tracker are cross-posted there so reporters are kept in the loop. We also
coordinate with the [LBRY Foundation's fork](https://github.com/LBRYFoundation/lbry-desktop).

## How releases happen

CI builds installers for every master push and pull request (download them from the
workflow run's artifacts). Releases are cut from version tags
([#664](https://github.com/bitcoinbrisbane/lbry-desktop/issues/664)):

1. Merge a release-prep PR that bumps `version` in `package.json` and adds the release's
   section to [CHANGELOG.md](CHANGELOG.md).
2. Tag that commit on master and push the tag: `git tag vX.Y.Z && git push origin vX.Y.Z`.
   The tag must match the `package.json` version.
3. The tag's CI build uploads the Linux, macOS and Windows installers to a **draft** GitHub
   release for that version. Only tag builds publish, so later master pushes can't overwrite it.
4. Paste the CHANGELOG section into the draft's notes and publish it
   (or `gh release edit vX.Y.Z --draft=false`).

macOS builds are currently unsigned (right-click → Open) until
[#576](https://github.com/bitcoinbrisbane/lbry-desktop/issues/576) lands.
