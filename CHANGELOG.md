# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/).

The LBRY Web UI comes bundled as part of [LBRYApp](https://github.com/lbryio/lbry-app).
Web UI version numbers should always match the corresponding version of LBRY App.

## [Unreleased]
### Added
  *
  *

### Changed
  *
  *

### Fixed
  * Error modals now display full screen properly
  *

### Deprecated
  *
  *

### Removed
  *
  *

## [0.10.0] - 2017-05-04

### Added
 * The UI has been overhauled to use an omnibar and drop the sidebar.
 * The app is much more responsive switching pages. It no longer reloads the entire page and all assets on each page change.
 * lbry.js now offers a subscription model for wallet balance similar to file info.
 * Fixed file info subscribes not being unsubscribed in unmount.
 * Fixed drawer not highlighting selected page.
 * You can now make API calls directly on the lbry module, e.g. lbry.peer_list()
 * New-style API calls return promises instead of using callbacks
 * Wherever possible, use outpoints for unique IDs instead of names or SD hashes
 * New publishes now display immediately in My Files, even before they hit the lbrynet file manager.
 * New welcome flow for new users
 * Redesigned UI for Discover
 * Handle more of price calculations at the daemon layer to improve page load time
 * Add special support for building channel claims in lbryuri module
 * Enable windows code signing of binary


### Changed
 * Update process now easier and more reliable
 * Updated search to be compatible with new Lighthouse servers
 * Cleaned up shutdown logic
 * Support lbry v0.10 API signatures


### Fixed
 * Fix Watch page and progress bars for new API changes



## [0.9.0rc15] - 2017-03-09
### Added
 * A way to access the Developer Settings panel in Electron (Ctrl-Shift and click logo)
 * Option in Developer Settings to toggle developer menu
### Changed
 * Open and reveal files using Electron instead of daemon

## [0.9.0rc12] - 2017-03-06
### Changed
 * Improved ability to style FormFields and form field labels
 * Refactored Publish page to use form field changes

## [0.9.0rc11] - 2017-02-27
### Added
 * "Back to LBRY" button on Watch page
### Changed
 * In error modal, hide details in expandable section
### Fixed
 * On load screen, always show Cancel link if a previous page is available
 * When user hits "Watch," don't check balance if download already started
 * Restore UI version on Help page
 * Fix sorting on My Files page

## [0.9.0rc9] - 2017-02-22
### Changed
 * Use local file for publishing
 * Use local file and html5 for video playback
 * Misc changes needed to make UI compatible with electron
