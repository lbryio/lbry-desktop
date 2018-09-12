# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/).

## [Unreleased]

### Added

### Changed

### Fixed


## [0.25.1] - 2018-09-18

### Fixed
 * Paragraph rendering now properly includes a margin for new paragraphs ([#1939](https://github.com/lbryio/lbry-desktop/pull/1939))
 * Alignment of "navigate to page" input next to pagination on channel pages ([#1941](https://github.com/lbryio/lbry-desktop/pull/1941))
 * Table spacing with claim name in transactions table ([#1942](https://github.com/lbryio/lbry-desktop/pull/1942))
 * Ability to click away from tip screen without the cancel button ([#1944](https://github.com/lbryio/lbry-desktop/pull/1944))
 * Disallow invalid tip amounts ([#1947](https://github.com/lbryio/lbry-desktop/pull/1947))
 * Ensure we record views for downloaded content from subscriptions and autoplay ([#1962](https://github.com/lbryio/lbry-desktop/pull/1962))

## [0.25.0] - 2018-08-29

### Added
 * Wallet encryption/decryption user flows in settings ([#1785](https://github.com/lbryio/lbry-desktop/pull/1785))
 * Suggestions for recommended content on file page ([#1845](https://github.com/lbryio/lbry-desktop/pull/1845))
 * Auto download setting for subscriptions ([#1898](https://github.com/lbryio/lbry-desktop/pull/1898))
 * Ability to disable desktop notifications ([#1834](https://github.com/lbryio/lbry-desktop/pull/1834))
 * Better preview for content ([#620](https://github.com/lbryio/lbry-desktop/pull/620))
 * New markdown and docx viewer ([#1826](https://github.com/lbryio/lbry-desktop/pull/1826))
 * New viewer for human-readable text files ([#1826](https://github.com/lbryio/lbry-desktop/pull/1826))
 * CSV and JSON viewer ([#1410](https://github.com/lbryio/lbry-desktop/pull/1410))
 * 3D File viewer features and performance/memory usage improvements ([#1870](https://github.com/lbryio/lbry-desktop/pull/1870))
 * Desktop notification when publish is completed ([#1892](https://github.com/lbryio/lbry-desktop/pull/1892))
 * FAQ to Publishing Area ([#1833](https://github.com/lbryio/lbry-desktop/pull/1833))
 * FAQ to wallet security area ([#1917](https://github.com/lbryio/lbry-desktop/pull/1917))
 
### Changed
 * Upgraded LBRY Protocol to [version 0.21.2](https://github.com/lbryio/lbry/releases/tag/v0.21.2) fixing a download bug.
 * Searching now shows results by default, including direct lbry:// URL tile ([#1875](https://github.com/lbryio/lbry-desktop/pull/))
 * Replaced checkboxes with toggles throughout app ([#1834](https://github.com/lbryio/lbry-desktop/pull/1834))
 * Removed price tile when content is Free ([#1845](https://github.com/lbryio/lbry-desktop/pull/1845))
 * Pass error message from spee.ch API during thumbnail upload ([#1840](https://github.com/lbryio/lbry-desktop/pull/1840))
 * Use router pattern for rendering file viewer ([#1544](https://github.com/lbryio/lbry-desktop/pull/1544))
 * Missing word "to" added to the Bid Help Text ([#1854](https://github.com/lbryio/lbry-desktop/pull/1854))
 * Updated to electron@2 ([#1858](https://github.com/lbryio/lbry-desktop/pull/1858))

### Fixed
 * Node id not being passed correctly ([#1895](https://github.com/lbryio/lbry-desktop/pull/1895))
 * Subscription quirks including not loading on startup, sorting, showing new content, and sub blank page ([#1872](https://github.com/lbryio/lbry-desktop/pull/1872))
 * Upgrade on Close button not dismissing properly during automated app update ([#1857](https://github.com/lbryio/lbry-desktop/pull/1857))

## [0.24.0] - 2018-08-14

### Fixed
 * Issue where the publish page would show "Editing" on a new publish ([#1864](https://github.com/lbryio/lbry-desktop/pull/1864))

### Changed
 * Upgrade LBRY Protocol to [version 0.21.1](https://github.com/lbryio/lbry/releases/tag/v0.21.1) which should improve download speed and availability.
 * Show label when publish button is disabled while uploading thumbnail to spee.ch ([#1867](https://github.com/lbryio/lbry-desktop/pull/1867))

## [0.23.1] - 2018-08-01

### Fixed
  * Fix ShapeShift integration ([#1842](https://github.com/lbryio/lbry-desktop/pull/1842))


## [0.23.0] - 2018-07-25

### Fixed
 * **Wallet -> Get Credits** page now shows correct ShapeShift status when it's avialable ([#1836](https://github.com/lbryio/lbry-desktop/issues/1836))
 * Fix middle click link error ([#1843](https://github.com/lbryio/lbry-desktop/issues/1843)}
 * Problem with search auto-complete menu when scrolling over file viewer ([#1847](https://github.com/lbryio/lbry-desktop/issues/1847))
 * Show label when publish button is disabled while uploading thumbnail to spee.ch ([#1867](https://github.com/lbryio/lbry-desktop/pull/1867))

### Added
 * 3D file viewer for OBJ & STL file types ([#1558](https://github.com/lbryio/lbry-desktop/pull/1558))
 * Thumbnail preview on publish page ([#1755](https://github.com/lbryio/lbry-desktop/pull/1755))
 * Abandoned claim transactions now show in wallet history ([#1769](https://github.com/lbryio/lbry-desktop/pull/1769))
 * Emoji support in the claim description ([#1800](https://github.com/lbryio/lbry-desktop/pull/1800))
 * PDF preview ([#1576](https://github.com/lbryio/lbry-desktop/pull/1576))

### Changed
  * Upgraded LBRY Protocol to [version 0.20.4](https://github.com/lbryio/lbry/releases/tag/v0.20.4) to assist with download availability and lower CPU usage on idle.
  * Upgraded Electron-Builder and Updater to support signing the daemon and improving the auto update process ([#1784](https://github.com/lbryio/lbry-desktop/pull/1784))
  * Channel page now uses caching, faster switching between channels/claims ([#1750](https://github.com/lbryio/lbry-desktop/pull/1750))
  * Only show video error modal if you are on the video page & don't retry to play failed videos ([#1768](https://github.com/lbryio/lbry-desktop/pull/1768))
  * Actually hide NSFW files if a user chooses to hide NSFW content via the settings page ([#1748](https://github.com/lbryio/lbry-desktop/pull/1748))
  * Hide the "Community top bids" section if user chooses to hide NSFW content ([#1760](https://github.com/lbryio/lbry-desktop/pull/1760))
  * More descriptive error message when Shapeshift is unavailable ([#1771](https://github.com/lbryio/lbry-desktop/pull/1771))
  * Rename the Github repo to lbry-desktop ([#1765](https://github.com/lbryio/lbry-desktop/pull/1765))


### Fixed
  * Edit option missing from certain published claims ([#1756](https://github.com/lbryio/lbry-desktop/issues/1756))
  * Navigation issue with channels that have more than one page ([#1797](https://github.com/lbryio/lbry-desktop/pull/1797))
  * Navigation issue with channels that have more than one page ([#1797](https://github.com/lbryio/lbry-desktop/pull/1797))
  * Upgrade modals would stack on-top of each other if the app was kept open for a long time ([#1857](https://github.com/lbryio/lbry-desktop/pull/1857))


## [0.22.2] - 2018-07-09

### Fixed
  * Fixed 'Get Credits' screen so the app doesn't break when LBC is unavailable on ShapeShift ([#1739](https://github.com/lbryio/lbry-desktop/pull/1739))


## [0.22.1] - 2018-07-05

### Added


### Fixed
  * Take previous bid amount into account when determining how much users have available to deposit ([#1725](https://github.com/lbryio/lbry-desktop/pull/1725))
  * Sidebar sizing on larger screens ([#1709](https://github.com/lbryio/lbry-desktop/pull/1709))
  * Publishing scenario while editing and changing URI ([#1716](https://github.com/lbryio/lbry-desktop/pull/1716))
  * Fix can't right click > paste into description on publish ([#1664](https://github.com/lbryio/lbry-desktop/issues/1664))
  * Mac/Linux error when starting app up too quickly after shutdown ([#1727](https://github.com/lbryio/lbry-desktop/pull/1727))
  * Console errors when multiple downloads for same claim exist ([#1724](https://github.com/lbryio/lbry-desktop/pull/1724))
  * App version in dev mode ([#1722](https://github.com/lbryio/lbry-desktop/pull/1722))
  * Long URI name displays in transaction list/Help ([#1694](https://github.com/lbryio/lbry-desktop/pull/1694))/([#1692](https://github.com/lbryio/lbry-desktop/pull/1692))


### Changed
  * Show claim name, instead of URI, when loading a channel([#1711](https://github.com/lbryio/lbry-desktop/pull/1711))
  * Updated LBRY daemon to 0.20.3 which contains some availability improvements ([v0.20.3](https://github.com/lbryio/lbry/releases/tag/v0.20.3))
  * Change startup error message to be more specific about repairing install([#1749](https://github.com/lbryio/lbry-desktop/issues/1749))

## [0.22.0] - 2018-06-26

### Added
   * Ability to upload thumbnails through spee.ch while publishing ([#1248](https://github.com/lbryio/lbry-desktop/pull/1248))
   * QR code for wallet address to Send and Receive page ([#1582](https://github.com/lbryio/lbry-desktop/pull/1582))
   * "View on Web" button on file/channel pages with spee.ch link ([#1222](https://github.com/lbryio/lbry-desktop/pull/1222))
   * Autoplay downloaded and free media along with toggle ([#584](https://github.com/lbryio/lbry-desktop/pull/1453))
   * Ability to get latest claims from channel on homepage (currently inactive) ([#1267](https://github.com/lbryio/lbry-desktop/pull/1267))
   * Confirmation prompt when sending credits ([#1525](https://github.com/lbryio/lbry-desktop/pull/1525))
   * Ability to right click > copy lbry:// hyperlink on tiles ([#1486](https://github.com/lbryio/lbry-desktop/pull/1486))
   * Buttons to open log file and log directory on the help page ([#1556](https://github.com/lbryio/lbry-desktop/issues/1556))
   * Ability to resend verification email ([#1492](https://github.com/lbryio/lbry-desktop/issues/1492))
   * Keyboard shortcut to quit the app on Windows ([#1202](https://github.com/lbryio/lbry-desktop/pull/1202))
   * Build for both architectures (x86 and x64) for Windows ([#1262](https://github.com/lbryio/lbry-desktop/pull/1262))
   * Referral FAQ to Invites screen ([#1314](https://github.com/lbryio/lbry-desktop/pull/1314))
   * Show exact wallet balance on mouse hover over ([#1305](https://github.com/lbryio/lbry-desktop/pull/1305))
   * Pre-fill publish URL after clicking "Put something here" link ([#1303](https://github.com/lbryio/lbry-desktop/pull/1303))
   * Danger JS to automate code reviews ([#1289](https://github.com/lbryio/lbry-desktop/pull/1289))
   * 'Go to page' input on channel pagination ([#1166](https://github.com/lbryio/lbry-desktop/pull/1166))

### Changed
   * LBRY App UI Redesign 5.0 implemented including new theme, layout, and improved search mechanics ([#870](https://github.com/lbryio/lbry-desktop/pull/870)) and ([#1173](https://github.com/lbryio/lbry-desktop/pull/1173))
   * Updated LBRY daemon to 0.20.2 which improves speed and reliability. ([v0.20.0](https://github.com/lbryio/lbry/releases/tag/v0.20.0), [v0.20.1](https://github.com/lbryio/lbry/releases/tag/v0.20.1), [v0.20.2](https://github.com/lbryio/lbry/releases/tag/v0.20.2))
   * Adapted dark mode to redesign ([#1269](https://github.com/lbryio/lbry-desktop/pull/1269))
   * Show latest claims for across all subscribed channel (no longer grouped by channel) and store sub data in internal database ([#1424](https://github.com/lbryio/lbry-desktop/pull/1424))
   * New publishes now show as pending on Publishes screen ([#1040](https://github.com/lbryio/lbry-desktop/pull/1040))
   * Enhanced flair to snackbar ([#1313](https://github.com/lbryio/lbry-desktop/pull/1313))
   * Made font in price badge larger ([#1420](https://github.com/lbryio/lbry-desktop/pull/1420))
   * Move rewards logic to interal api ([#1509](https://github.com/lbryio/lbry-desktop/pull/1509))
   * Narrative about Feature Request on Help Page and Report Page ([#1551](https://github.com/lbryio/lbry-desktop/pull/1551))


### Fixed
   * Create channel and publish immediately([#1481](https://github.com/lbryio/lbry-desktop/pull/1481))
   * Price not updated on tile/file page ([#797](https://github.com/lbryio/lbry-desktop/issues/797))
   * Markdown rendering support on show page ([#1179](https://github.com/lbryio/lbry-desktop/issues/1179))
   * Content address extending outside of visible area ([#741](https://github.com/lbryio/lbry-desktop/issues/741))
   * Content-type not shown correctly in file description ([#863](https://github.com/lbryio/lbry-desktop/pull/863))
   * Fix [Flow](https://flow.org/) ([#1197](https://github.com/lbryio/lbry-desktop/pull/1197))
   * Black screen on macOS after maximizing LBRY and then closing ([#1235](https://github.com/lbryio/lbry-desktop/pull/1235))
   * Download percentage indicator overlay ([#1271](https://github.com/lbryio/lbry-desktop/issues/1271))
   * Alternate row shading for transactions on dark theme ([#1355](https://github.com/lbryio/lbry-desktop/issues/#1355))
   * Don't allow dark mode with automatic night mode enabled ([#1005](https://github.com/lbryio/lbry-desktop/issues/1005))
   * Description box on Publish (dark theme) ([#1356](https://github.com/lbryio/lbry-desktop/issues/#1356))
   * Price wrapping in price badge ([#1420](https://github.com/lbryio/lbry-desktop/pull/1420))
   * Spacing in search suggestions ([#1422](https://github.com/lbryio/lbry-desktop/pull/1422))
   * Text/HTML files don't display correctly in-app anymore ([#1379](https://github.com/lbryio/lbry-desktop/issues/1379))
   * Notification modals when reward is claimed ([#1436](https://github.com/lbryio/lbry-desktop/issues/1436)) and ([#1407](https://github.com/lbryio/lbry-desktop/issues/1407))
   * Disabled cards(grayed out) ([#1466](https://github.com/lbryio/lbry-desktop/issues/1466))
   * New lines not showing correctly after markdown changes ([#1504](https://github.com/lbryio/lbry-desktop/issues/1504))
   * Claim ID being null when reporting a claim that was not previously downloaded ([PR#1530](https://github.com/lbryio/lbry-desktop/pull/1530))
   * URI and outpoint not being passed properly to API ([#1494](https://github.com/lbryio/lbry-desktop/issues/1494))
   * Incorrect markdown preview on url with parentheses ([#1570](https://github.com/lbryio/lbry-desktop/issues/1570))
   * Fix Linux upgrade path and add manual installation note ([#1606](https://github.com/lbryio/lbry-desktop/issues/1606))
   * Fix can type in unfocused fields while publishing without selecting file ([#1456](https://github.com/lbryio/lbry-desktop/issues/1456))
   * Fix navigation button resulting incorrect page designation ([#1502](https://github.com/lbryio/lbry-desktop/issues/1502))
   * Fix shouldn't allow to open multiple export and choose file dialogs ([#1175](https://github.com/lbryio/lbry-desktop/issues/1175))



## [0.21.6] - 2018-06-05

### Fixed
 * Fix page URLs on app cold start ([#1549](https://github.com/lbryio/lbry-desktop/issues/1549))
 * Fix analytics event ([#1494](https://github.com/lbryio/lbry-desktop/issues/1494))



## [0.21.5] - 2018-05-31

### Added
  * Ability to navigate to in-app pages via URL ([#1352](https://github.com/lbryio/lbry-desktop/issues/1352))

### Fixed
 * Fixed green screen on invalid URL via hyperlink ([#959](https://github.com/lbryio/lbry-desktop/issues/959))
 * Fixed crash when lbry-desktop repository is renamed to lbry-desktop ([#1505](https://github.com/lbryio/lbry-desktop/issues/1505))
 * Fixed rewards not disappearing after claiming ([596](https://github.com/lbryio/lbry-desktop/issues/596))

### Changed
 * Rewards now rely on API data ([#1329](https://github.com/lbryio/lbry-desktop/issues/1329))



## [0.21.4] - 2018-05-10

### Changed
  * Update LBRY Protocol to 0.19.3 - faster blockchain header download for new and existing users (See fulll change log for [0.19.2](https://github.com/lbryio/lbry/releases/tag/v0.19.2) and [0.19.3](https://github.com/lbryio/lbry/releases/tag/v0.19.3))

### Fixed
 * Ability to submit bug reports



## [0.21.3] - 2018-04-23

### Added
 * Block blacklisted content ([#1361](https://github.com/lbryio/lbry-desktop/pull/1361))


## [0.21.2] - 2018-03-22

### Added
  * Save app state when closing to tray ([#968](https://github.com/lbryio/lbry-desktop/issues/968))
  * Added startup-troubleshooting FAQ URL to daemon error ([#1039](https://github.com/lbryio/lbry-desktop/pull/1039))
  * Added ability to export wallet transactions to JSON and CSV format ([#976](https://github.com/lbryio/lbry-desktop/pull/976))
  * Add Rewards FAQ to LBRY app ([#1041](https://github.com/lbryio/lbry-desktop/pull/1041))
  * Notifications when the channel a user subscribes to uploads new content ([#1066](https://github.com/lbryio/lbry-desktop/pull/1066))
  * Codacy support for Github contributions ([#1059](https://github.com/lbryio/lbry-desktop/pull/1059))
  * App category for Linux ([#877](https://github.com/lbryio/lbry-desktop/pull/877))
  * Add YouTube Sync reward ([#1147](https://github.com/lbryio/lbry-desktop/pull/1147))
  * Retain previous screen sizing on startup ([#338](https://github.com/lbryio/lbry-desktop/issues/338))


### Changed
  * Update LBRY Protocol to 0.19.1 (See change log for [0.19.0](https://github.com/lbryio/lbry/releases/tag/v0.19.0) and [0.19.1](https://github.com/lbryio/lbry/releases/tag/v0.19.1))
  * Improved privacy by allowing users to turn off the file view counter and better understand privacy settings ([#1074](https://github.com/lbryio/lbry-desktop/pull/1074) / [#1116](https://github.com/lbryio/lbry-desktop/pull/1116))
  * Disabled auto dark mode if dark mode is selected ([#1006](https://github.com/lbryio/lbry-desktop/pull/1006))
  * Refactor Electron's main process ([#951](https://github.com/lbryio/lbry-desktop/pull/951))
  * Refactor `lbryuri.js` into separate named exports ([#957](https://github.com/lbryio/lbry-desktop/pull/957))
  * Keep node_modules up-to-date when yarn.lock changes due to git ([#955](https://github.com/lbryio/lbry-desktop/pull/955))
  * Do not kill an existing daemon, instead check if one exists ([#973](https://github.com/lbryio/lbry-desktop/pull/973))
  * Enable play button immediately after user clicks download ([#987](https://github.com/lbryio/lbry-desktop/pull/987))
  * Significantly improved search performance ([#1032](https://github.com/lbryio/lbry-desktop/pull/1032))
  * Allow editing of claims when bid is greater than current balance ([#1105](https://github.com/lbryio/lbry-desktop/pull/1105))


### Fixed
  * Fixed sort by date of published content ([#986](https://github.com/lbryio/lbry-desktop/issues/986))
  * Fix night mode start time, set to 9PM ([#1050](https://github.com/lbryio/lbry-desktop/issues/1050))
  * Disable drag and drop of files into the app ([#1045](https://github.com/lbryio/lbry-desktop/pull/1045))
  * Fixed uninformative error message ([#1046](https://github.com/lbryio/lbry-desktop/pull/1046))
  * Update documentation for DevTools and fix some ESLint warnings ([#911](https://github.com/lbryio/lbry-desktop/pull/911))
  * Fix right click bug ([#928](https://github.com/lbryio/lbry-desktop/pull/928))
  * Fix Election linting errors ([#929](https://github.com/lbryio/lbry-desktop/pull/929))
  * App will no longer reset when minimizing to tray ([#1042](https://github.com/lbryio/lbry-desktop/pull/1042))
  * Error when clicking LBRY URLs when app is closed on macOS ([#1119](https://github.com/lbryio/lbry-desktop/issues/1119))
  * LBRY URLs not working on Linux ([#1120](https://github.com/lbryio/lbry-desktop/issues/1120))
  * Fix Windows notifications not showing ([#1145](https://github.com/lbryio/lbry-desktop/pull/1145))
  * Fix export issues ([#1163](https://github.com/lbryio/lbry-desktop/pull/1163))

## [0.20.0] - 2018-01-30

### Added
 * Added Automatic Dark Mode ([#950](https://github.com/lbryio/lbry-desktop/pull/950))
 * Re-introduce build dir / dist dir option for isolated build environments ([#933](https://github.com/lbryio/lbry-desktop/pull/933))
 * Added sms as a method for reward identity verification ([#946](https://github.com/lbryio/lbry-desktop/pull/946))
 * Added auto-update ([#808](https://github.com/lbryio/lbry-desktop/pull/808))


### Changed
 * Refactored Electron's main process ([#951](https://github.com/lbryio/lbry-desktop/pull/951))
 * Refactored lbryuri.js into separate named exports ([#957](https://github.com/lbryio/lbry-desktop/pull/957))
 * Upgraded Daemon to [version 18.2](https://github.com/lbryio/lbry/releases/tag/v0.18.2) ([#961](https://github.com/lbryio/lbry-desktop/pull/961))
 * Upgraded Electron for security patch ([commit](https://github.com/lbryio/lbry-desktop/commit/48cc82b86d79ea35e3c529b420957d9dd6043209))


### Fixed
 * Fixed issues in documentation ([#945](https://github.com/lbryio/lbry-desktop/pull/945))
 * Fixed linting errors ([#929](https://github.com/lbryio/lbry-desktop/pull/929))



## [0.19.4] - 2018-01-08

### Added
 * Video state tracking in redux - developer only ([#890](https://github.com/lbryio/lbry-desktop/pull/890))


### Changed
 * Improved text content in app ([#921](https://github.com/lbryio/lbry-desktop/pull/921))


### Fixed
 * Right click works in the app again ([#928](https://github.com/lbryio/lbry-desktop/pull/928))
 * Icons are now the rights size ([#925](https://github.com/lbryio/lbry-desktop/pull/925))
 * Fixed tip sending error ([#918](https://github.com/lbryio/lbry-desktop/pull/918))
 * Newly created channel immediately available for publishing



## [0.19.3] - 2017-12-30

### Changed
 * Improved internal code structuring by adding linting integration -- developers only ([#891](https://github.com/lbryio/lbry-desktop/pull/891))
 * Improved developer documentation ([#910](https://github.com/lbryio/lbry-desktop/pull/910))


### Removed
 * Removed email verification reward ([#914](https://github.com/lbryio/lbry-desktop/pull/921))


### Fixed
 * Added snackbar text in place where it was coming up blank ([#902](https://github.com/lbryio/lbry-desktop/pull/902))



## [0.19.2] - 2017-12-22

### Added
 * Added copy address button to the Wallet Address component on Send / Receive ([#875](https://github.com/lbryio/lbry-desktop/pull/875))
 * Link to creators’ channels on homepage ([#869](https://github.com/lbryio/lbry-desktop/pull/869))
 * Pause playing video when file is opened ([#880](https://github.com/lbryio/lbry-desktop/pull/880))
 * Add captcha to verification process ([#897](https://github.com/lbryio/lbry-desktop/pull/897))


### Changed
 * Contributor documentation ([#879](https://github.com/lbryio/lbry-desktop/pull/879))


### Fixed
 * Linux app categorization ([#877](https://github.com/lbryio/lbry-desktop/pull/877))



## [0.19.1] - 2017-12-13

### Added
 * Added empty rewards message on overview page ([#847](https://github.com/lbryio/lbry-desktop/pull/847))


### Changed
 * Updated developer tools and restructured code ([#861](https://github.com/lbryio/lbry-desktop/pull/861) / [#862](https://github.com/lbryio/lbry-desktop/pull/862))


### Fixed
 * Fixed typos ([#845](https://github.com/lbryio/lbry-desktop/pull/845) / [#846](https://github.com/lbryio/lbry-desktop/pull/846))
 * Fixed theme-related error while running in development ([#865](https://github.com/lbryio/lbry-desktop/pull/865))
 * Fixed build/signing error on Windows ([#864](https://github.com/lbryio/lbry-desktop/pull/864))



## [0.19.0] - 2017-12-11

### Added
 * [Subscriptions](https://github.com/lbryio/lbry-desktop/issues/715). File and channel pages now show a subscribe button. A new "Subscriptions" tab appears on the homepage shows the most recent content from subscribed channels.
 * [LBC acquisition widget](https://github.com/lbryio/lbry-desktop/issues/609). Convert other popular cryptos into LBC via a ShapeShift integration.
 * [Flow](https://flow.org/) static type checking. This is a dev-only feature, but will make development faster, less error prone, and better for newcomers.


### Changed
 * The first run process for new users has changed substantially. New users can now easily receive one credit.
 * The wallet area has been re-organized. Send and Receive are now on the same page. A new page, "Get Credits", explains how users can add LBRY credits to the app.
 * Significant structural changes to code organization, packaging, and building. The app now follows a typical electron folder structure. All 3 `package.json` files have been reduced to a single file. Redux related code was moved into it's own subfolder.
 * The macOS docking icon has been improved.
 * The prompt for an insufficient balance is much more user-friendly.
 * The credit balance displayed in the main app navigation displays two decimal places instead of one.
 * Video download error messages are now more understandable.([#328](https://github.com/lbryio/lbry-desktop/issues/328))
 * Windows path to the daemon/CLI executables changed to: `C:\Program Files (x86)\LBRY\resources\static\daemon`


### Deprecated
 * We previous had two separate modals for insufficient credits. These have been combined.


### Fixed
 * Long channel names causing inconsistent thumbnail sizes ([#721](https://github.com/lbryio/lbry-desktop/issues/721))
 * Channel names in pages are highlighted to indicate them being clickable ([#814](https://github.com/lbryio/lbry-desktop/issues/814))
 * Fixed the transaction screen not loading for brand new users ([#755](https://github.com/lbryio/lbry-desktop/issues/755))
 * Fixed issues with scrolling and back and forward navigation ([#729](https://github.com/lbryio/lbry-desktop/issues/729))
 * Fixed sorting by title for published files ([#614](https://github.com/lbryio/lbry-desktop/issues/614))
 * App now uses the new `balance_delta` field provided by the LBRY API ([#611](https://github.com/lbryio/lbry-desktop/issues/611))
 * Abandoning from the claim page now works.([#883](https://github.com/lbryio/lbry-desktop/issues/833))



## [0.18.2] - 2017-11-15

### Fixed
 * Email verification is fixed. (#746)



## [0.18.0] - 2017-11-13

### Added
 * Trending! The landing page of the app now features content that is surging in popularity relative to past interest.
 * The app now closes to the system tray. This will help improve publish seeding and network performance. Directing the app to quit or exit will close it entirely. (#374)
 * You can now revoke past publishes to receive your credits. (#581)
 * You can now unlock tips sent to you so you can send them elsewhere or spend them. (#581)
 * Added new window menu options for reloading and help.
 * Rewards are now marked in transaction history (#660)


### Changed
 * Daemon updated to [v0.18.0](https://github.com/lbryio/lbry/releases/tag/v0.18.0). The largest changes here are several more network improvements and fixes as well as functionality and improvements related to concurrent heavier usage (bugs and issues largely discoverd by spee.ch).
 * Improved build and first-run process for new developers.
 * Replaced all instances of `XMLHttpRequest` with native `Fetch` API (#676).


### Fixed
 * Fixed console errors on settings page related to improper React input properties.
 * Fixed modals being too narrow after font change (#709)
 * Fixed bug that prevented new channel and first publish rewards from being claimed (#290)



## [0.17.1] - 2017-10-25

### Changed
 * Updated daemon to 0.17.1. 0.17.1 contains several more download fixes that are backwards incompatible, making this a near mandatory upgrade.
 * Continuing to standardize and improve design. File selectors, checkboxes, radios, and a number of other elements got substantial improvements.
 * [Electron](https://github.com/electron/electron) version upgraded. Most relevantly, this fixes URI handling in Linux.
 * Chat links and text updated to remove references to Slack.


### Fixed
 * Fixed handling of empty search results.
 * Fixed minimum channel length name(#689).



## [0.17.0] - 2017-10-12

### Added
 * Added a new search service. Significantly improved search results.
 * Channels now appear in search results. Channel cards to be improved soon?.
 * Add setting to automatically purchase low-cost content without a confirmation dialog.
 * New custom styled scrollbar (#574)
 * New tabs (#576).


### Changed
 * LBRY protocol upgraded from v0.16.1 to [v0.17](https://github.com/lbryio/lbry/releases/tag/v0.17.0). Significant improvements to download performance anticipated.
 * Improved Discover page load time by batching all URIs into one API call.
 * Changed the File page to make it clearer how to to open the folder for a file.
 * Display search bar on discover page instead of title and remove duplicated icon.
 * Minor update for themes.
 * There is no longer a minimum channel length (#645)
 * Changed the File page to make it clearer how to to open the folder for a file
 * The upgrade message is now friendlier and includes a link to the release notes.
 * Local settings refactored and no longer intermixed with LBRY API library.


### Fixed
 * Improve layout (and implementation) of the icon panel in file tiles and cards
 * The folder icon representing a local download now shows up properly on Channel pages (#587)
 * While editing a publish, the URL will no longer change if you select a new file. (#601)
 * Fixed issues with opening the folder for a file (#606)
 * Be consistent with the step property on credit inputs (#604)
 * Fixed unresponsive header (#613)
 * Fixed dark theme issues with text content.
 * Minor css fixes.
 * Fixed issue when file fails to download (#642)
 * Fixed issue after accessing a video without enough credits (#605)
 * Fixed channel fetching without claims (#634)



## [0.16.0] - 2017-09-21

### Added
 * Added a tipping button to send LBRY Credits to a creator.
 * Added an edit button on published content. Significantly improved UX for editing claims.
 * Added theme settings option and new Dark theme.
 * Significantly more detail is shown about past transactions and new filtering options for transactions.
 * File pages now show the time of a publish.
 * The "auth token" displayable on Help offers security warning
 * Added a new component for rendering dates and times. This component can render the date and time of a block height, as well.
 * Added a `Form` component, to further progress towards form sanity.
 * Added `gnome-keyring` dependency to .deb


### Changed
 * CSS significantly refactored to support CSS vars (and consequently easy theming).


### Fixed
 * URLs on cards no longer wrap and show an ellipsis if longer than one line



## [0.15.1] - 2017-09-08

### Added
 * File pages now show the time of a publish. This includes a new component for rendering dates and times that can render the date and time of a block height, as well.


### Changed
 * Updated to daemon [0.15.2](https://github.com/lbryio/lbry/releases/tag/v0.15.2) to prevent a bug in USD purchases.


### Fixed
 * Potential fix for blank error popup when streaming (#536)
 * Fixed some popups showing improperly while balance was loading (#534)
 * Show a security warning when the auth token is displayed on Help.
 * Some CSS changes to prevent the card row from clipping the scroll arrows after the window width is reduced below a certain point
 * Clearly notify user when they try to send credits to an invalid address (#445)



## [0.15.0] - 2017-08-31

### Added
 * Added an Invites area inside of the Wallet. This allows users to invite others and shows the status of all past invites (including all invite data from the past year). Up to one referral reward can now be claimed, but only if both users have passed the humanity test.
 * Added new summary components for rewards and invites to the Wallet landing page.
 * Added a forward button and improved history behavior. Back/forward disable when unusable.
 * Added past history of rewards to the rewards page.
 * Added wallet backup guide reference.
 * Added a new widget for setting prices (`FormFieldPrice`), used in Publish and Settings.


### Changed
 * Updated to daemon [0.15](https://github.com/lbryio/lbry/releases). Most relevant changes for app are improved announcing of content and a fix for the daemon getting stuck running.
 * Significant refinements to first-run process, process for new users, and introducing people to LBRY and LBRY credits.
 * Changed Wallet landing page to summarize status of other areas. Refactored wallet and transaction logic.
 * Added icons to missing page, improved icon and title logic.
 * Changed the default price settings for priced publishes.
 * When an "Open" button is clicked on a show page, if the file fails to open, the app will try to open the file's folder.
 * Updated several packages and fixed warnings in build process (all but the [fsevents warning](https://github.com/yarnpkg/yarn/issues/3738), which is a rather dramatic debate)
 * Some form field refactoring as we take baby steps towards form sanity.
 * Replaced confusing placeholder text from email input.
 * Refactored modal and settings logic.
 * Refactored history and navigation logic.


### Removed
 * Removed the label "Max Purchase Price" from settings page. It was redundant.
 * Unused old files from previous commit(9c3d633)


### Fixed
 * Tiles will no longer be blurry on hover (Windows only bug)
 * Removed placeholder values from price selection form fields, which was causing confusion that these were real values (#426)
 * Fixed showing "other currency" help tip in publish form, which was caused due to not "setting" state for price
 * Publish page now properly checks for all required fields are filled
 * Fixed sizing on squat videos (#419)
 * Support claims no longer show up on Published page (#384)
 * Fixed rendering of small prices (#461)
 * Fixed incorrect URI in Downloads/Published page (#460)
 * Fixed menu bug (#503)
 * Fixed incorrect URLs on some channel content (#505)
 * Fixed video sizing for squat videos (#492)
 * Fixed issues with small prices (#461)
 * Fixed issues with negative values not being stopped by app on entry (#441)
 * Fixed source file error when editing existing claim (#467)



## [0.14.3] - 2017-08-03

### Added
 * Add tooltips to controls in header
 * New flow for rewards authentication failure


### Changed
 * Make it clearer how to skip identity verification and add link to FAQ
 * Reward-eligible content icon is now a rocket ship :D :D :D
 * Change install description shown by operating systems
 * Improved flow for when app is run with incompatible daemon


### Fixed
 * Corrected improper pluralization on loading screen



## [0.14.2] - 2017-07-30

### Added
 * Replaced horizontal scrollbars with scroll arrows
 * Featured weekly reward content shows with an orange star


### Fixed
 * Fixed requirement to double click play button on many videos
 * Fixed errors from calls to `get` not bubbling correctly
 * Fixed some corner-case flows that could break file pages



## [0.14.1] - 2017-07-28

### Fixed
 * Fixed upgrade file path missing file name



## [0.14.0] - 2017-07-28

### Added
 * Identity verification for new reward participants
 * Support rich markup in publishing descriptions and show pages.
 * Release past publishing claims (and recover LBC) via the UI
 * Added transition to card hovers to smooth animation
 * Use randomly colored tiles when image is missing from metadata
 * Added a loading message to file actions
 * URL is auto suggested in Publish Page


### Changed
 * Publishing revamped. Editing claims is much easier.
 * Daemon updated from v0.13.1 to [v0.14.2](https://github.com/lbryio/lbry/releases/tag/v0.14.2)
 * Publish page now use `claim_list` rather than `file_list`


### Removed
 * Removed bandwidth caps from settings, because the daemon was not respecting them anyway.


### Fixed
 * Fixed bug with download notice when switching window focus
 * Fixed newly published files appearing twice
 * Fixed unconfirmed published files missing channel name
 * Fixed old files from updated published claims appearing in downloaded list
 * Fixed inappropriate text showing on searches
 * Stop discover page from pushing jumping vertically while loading
 * Restored feedback on claim amounts
 * Fixed hiding price input when Free is checked on publish form
 * Fixed hiding new identity fields on publish form
 * Fixed files on downloaded tab not showing download progress
 * Fixed downloading files that are deleted not being removed from the downloading list
 * Fixed download progress bar not being cleared when a downloading file is deleted
 * Fixed refresh regression after adding scroll position to history state
 * Fixed app not monitoring download progress on files in progress between restarts



## [0.13.0] - 2017-06-30

### Added
 * State is persisted through app close and re-open, resulting in faster opens
 * Desktop notifications on downloads finishing
 * Support webm, ogg, m4v, and a few others
 * Translations added to build process
 * Claim IDs are shown in your published files


### Changed
 * Upgraded to lbry daemon 0.13, including updating API signatures
 * Channels resolve much faster
 * Resolve is no longer cancelled on navigate
 * Updated API and authentication used by rewards process
 * Improved security of reward credential storage
 * Additional information submitted in DMCA reports
 * Switched packaging to yarn


### Removed
 * The author metadata field is no longer shown, in favor of first-class identities
 * Availability is no longer checked before showing Download options, due to unreliability


### Fixed
 * Fix help menu force reloading whole app
 * Show page updates correctly when navigating from show page to another show page
 * NSFW setting respected on show page
 * URI handling navigates to correct page if app is closed
 * URI handling issues specific to Windows (maybe)
 * Changing the NSFW setting refreshes properly (previously required app restart)



## [0.12.0] - 2017-06-09

### Added
 * More file types, like audio and documents, can be streamed and/or served from the app
 * App is no longer gated. Reward authorization re-written. Added basic flows for new users.
 * Videos now have a classy loading spinner


### Changed
 * All UI strings are now rendered according to gettext standard, in prep for i18n
 * Switched to new fee metadata format


### Fixed
 * If a daemon is running but unresponsive, startup is no longer blocked indefinitely
 * Updated deprecated LBRY API call signatures
 * App scrolls to the top of the page on navigation
 * Download progress works properly for purchased but deleted files
 * Publish channels for less than 1 LBC



## [0.11.9] - 2017-06-01

### Fixed
 * Windows upgrade process fixed
 * Upgrade process on Mac and Linux will open the file rather than the folder



## [0.11.8] - 2017-05-31

### Fixed
 * Verified access from two different installation ids
 * Version upgrade check on help page



## [0.11.7] - 2017-05-30

### Changed
 * Video player switched from plyr to render-media


### Fixed
 * Video player should behave better on streaming
 * Daemon times out more quickly when it cannot start
 * Connection should fail more cleanly, rather than get stuck entirely
 * Closing modal dialogs was broken on some download and stream errors
 * Discover landing page improperly showed loading error when it was loading correctly



## [0.11.6] - 2017-05-29

### Changed
 * Do not use a separate claim cache for publishes


### Fixed
 * Upgrade process should now works on Windows
 * Crudely handle failed publishes missing outpoints



## [0.11.5] - 2017-05-28

### Fixed
 * Eliminated instance of costs being double fetched
 * Fixed issue preventing file re-download
 * Fixed race condition that could prevent file playbac
 * Fixed issue with batch actions and thunk



## [0.11.4] - 2017-05-26

### Added
 * New reward for watching weekly featured content


### Fixed
 * Video playback will always properly fetch cost info (this was a big playback bug)
 * Fixed view rewards



## [0.11.3] - 2017-05-26

### Fixed
 * Fixed always showing welcome message on run
 * "Fixed" upgrade process
 * Version info now shows properly on Help page
 * Claim info is properly accessed on Publish page



## [0.11.0] - 2017-05-25

### Added
 * Entire app re-written to use Redux as state store. Far saner and faster. Will also increase productivity moving forward.
 * Channel page shows content published in channel.
 * URI handling. Clicking lbry:// links should open the app and appropriate URI on all OSes.
 * File cards have an icon indicating you posses that file.
 * Download directory setting now uses a proper dialog.
 * Movie player automatically shows if the file has already been downloaded.


### Changed
 * Plyr replaces mediaelement as the movie player.


### Fixed
 * Publisher indicator on show pages and file cards/tiles will now always show the proper channel name.
 * Performance improvements related to avoiding duplicate fetches.
 * Fix incorrect prompt on empty published page



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
 * Support for opening LBRY URIs from links in other apps


### Changed
 * Update process now easier and more reliable
 * Updated search to be compatible with new Lighthouse servers
 * Cleaned up shutdown logic
 * Support lbry v0.10 API signatures


### Fixed
 * Fix Watch page and progress bars for new API changes
 * On Windows, prevent opening multiple LBRY instances (launching LBRY again just focuses the current instance)



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
