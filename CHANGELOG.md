# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/).

The LBRY Web UI comes bundled as part of [LBRYApp](https://github.com/lbryio/lbry-app).
Web UI version numbers should always match the corresponding version of LBRY App.

## [Unreleased]
### Added
  * A way to access the Developer Settings panel in Electron (Ctrl-Shift or Cmd-Shift and click logo)
  * Option in Developer Settings to toggle developer menu
  *

### Changed
  * Open and reveal files using Electron instead of daemon
  *
  *

### Fixed
  *
  *
  *

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
