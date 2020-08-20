# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased on desktop]

### Added

- New File Page layout + make sidebar collapsable ([#4648](https://github.com/lbryio/lbry-desktop/pull/4648))
- Block mature content when accessed directly from URL _community pr!_ ([#4560](https://github.com/lbryio/lbry-desktop/pull/4560))
- You can now add LBRY as a search engine in your browser (via OpenSearch) _community pr!_ ([#4640](https://github.com/lbryio/lbry-desktop/pull/4640))
- In-app text and markdown publishing and editing _community pr!_ ([#4591](https://github.com/lbryio/lbry-desktop/pull/4591))

### Changed

- Move file properties over thumbnails for more space-saving ([#4632](https://github.com/lbryio/lbry-desktop/pull/4632))

### Fixed

- Fix sluggish Back button when navigation back to channels with lots of comments _community pr!_ ([#4576](https://github.com/lbryio/lbry-desktop/pull/4576))
- Fix 'Related' and 'Comments' section lazy-load not working in some scenarios _community pr!_ ([#4586](https://github.com/lbryio/lbry-desktop/pull/4586))
- Fix comment-creation failure if you have recently deleted a channel _community pr!_ ([#4630](https://github.com/lbryio/lbry-desktop/pull/4630))
- Tip Modal: Don't do final submit when the intention is to create New Channel _community pr!_ ([#4629](https://github.com/lbryio/lbry-desktop/pull/4629))
- Fix related + search results loading slowly ([#4657](https://github.com/lbryio/lbry-desktop/pull/4657))

## [0.47.1] - [2020-07-23]

### Added

- Allow zooming on Desktop _community pr!_ ([#4513](https://github.com/lbryio/lbry-desktop/pull/4513))
- Show "YT Creator" label in File Page as well _community pr!_ ([#4523](https://github.com/lbryio/lbry-desktop/pull/4523))
- Add option to retry video stream on failure _community pr!_ ([#4541](https://github.com/lbryio/lbry-desktop/pull/4541))
- Allow blocking channels from comments ([#4557](https://github.com/lbryio/lbry-desktop/pull/4557))

### Changed

- Updated lbry-sdk to [0.79.1](https://github.com/lbryio/lbry-sdk/releases/tag/v0.79.1)

### Fixed

- Fix 'transcoding' checkbox state when switching file types _community pr!_ ([#4529](https://github.com/lbryio/lbry-desktop/pull/4529))
- Fix channel file-search not available in mobile _community pr!_ ([#4527](https://github.com/lbryio/lbry-desktop/pull/4527))
- New Channel: Fix incorrect GUI configuration at entry _community pr!_ ([#4545](https://github.com/lbryio/lbry-desktop/pull/4545))
- Hide blocked channels in comments ([#4557](https://github.com/lbryio/lbry-desktop/pull/4557))

## [0.47.0] - [2020-07-13]

### Added

- Add ability to sign supports ([#4382](https://github.com/lbryio/lbry-desktop/pull/4382))
- Add "tap to unmute" button for videos that start with audio muted _community pr!_ ([#4365](https://github.com/lbryio/lbry-desktop/pull/4365))
- Allow upgrade bar to be dismissed per session _community pr!_ ([#4413](https://github.com/lbryio/lbry-desktop/pull/4413))
- Pause the "autoplay next" timer when performing long operations such as Tipping, Supporting or commenting _community pr!_ ([4419](https://github.com/lbryio/lbry-desktop/pull/4419))
- Email notification management page ([#4409](https://github.com/lbryio/lbry-desktop/pull/4409))
- Publish Page improvements to prevent accidental overwrites of existing claims _community pr!_ ([#4416](https://github.com/lbryio/lbry-desktop/pull/4416))
- Option to remove abandoned claims from Blocked Channels page _community pr!_ ([#4433](https://github.com/lbryio/lbry-desktop/pull/4433))
- New channel create/edit page ([#4445](https://github.com/lbryio/lbry-desktop/pull/4445))
- Add dialog to copy various types of links for a claim _community pr!_ ([#4474](https://github.com/lbryio/lbry-desktop/pull/4474))
- Add password reset link to settings page for logged in users _community pr!_ ([#4473](https://github.com/lbryio/lbry-desktop/pull/4473))

### Changed

- Updated lbry-sdk to [0.77.0](https://github.com/lbryio/lbry-sdk/releases/tag/v0.77.0)
- Merged Tip and Support Buttons into one UI on file page ([#4382](https://github.com/lbryio/lbry-desktop/pull/4382))

### Fixed

- Fix report page layout ([#4384](https://github.com/lbryio/lbry-desktop/pull/4384))
- Fix language-change not applied to components immediately _community pr!_ ([#4437](https://github.com/lbryio/lbry-desktop/pull/4437))
- Fix scenarios where new search results are not appearing when scrolled to the bottom _community pr!_ ([4424](https://github.com/lbryio/lbry-desktop/pull/4424))
- Fix incorrect creator status shown when navigating between channels _community pr!_ ([#4438](https://github.com/lbryio/lbry-desktop/pull/4438))
- Fix unresolved translations in the Splash Screen _community pr!_ ([#4440](https://github.com/lbryio/lbry-desktop/pull/4440))
- Fix Notification page button being incorrectly disabled by 0 blocked channels _community pr!_ ([#4449](https://github.com/lbryio/lbry-desktop/pull/4449))
- Fix "Refresh" on Publish page not showing the loading indicator when pressed _community pr!_ ([#4451](https://github.com/lbryio/lbry-desktop/pull/4451))
- Fix video duration not appearing on Mobile with enough width _community pr!_ ([#4452](https://github.com/lbryio/lbry-desktop/pull/4452))
- Fix video transcode setting not reflected correctly (MP3 incorrectly transcoded to MP4) _community pr!_ ([#4458](https://github.com/lbryio/lbry-desktop/pull/4458))
- Fix scrolling glitch when results are exactly the page size _community pr!_ ([#4521](https://github.com/lbryio/lbry-desktop/pull/4521))
- Fix search results not appearing when scrolling due to long Tags or Following list in the navigation bar _community pr!_ ([#4465](https://github.com/lbryio/lbry-desktop/pull/4465))
- Fix unmuted state lost or reverted when playing a new video _community pr!_ ([#4483](https://github.com/lbryio/lbry-desktop/pull/4483))

## [0.46.2] - [2020-06-10]

### Added

- Make library view mode (Downloads|Purchases) persistent _community pr!_ ([#4363](https://github.com/lbryio/lbry-desktop/pull/4363))

### Changed

- Updated lbry-sdk to [0.76.0](https://github.com/lbryio/lbry-sdk/releases/tag/v0.76.0)

### Fixed

- Overflow issue when editing replies _community pr!_ ([#4356](https://github.com/lbryio/lbry-desktop/pull/4356))
- Comments wrapping in the middle of a word _community pr!_ ([#4354](https://github.com/lbryio/lbry-desktop/pull/4354))
- Translation improvements _community pr!_ ([multiple PR's](https://github.com/lbryio/lbry-desktop/pulls?q=is%3Apr+author%3ATigerxWood+sort%3Aupdated-desc+is%3Amerged))

## [0.46.1] - [2020-06-08]

### Fixed

- Fix download button not working on claim previews ([1dcf16b](https://github.com/lbryio/lbry-desktop/commit/1dcf16b0b4dffff6335e8fdf988d38673243e014))
- Fix app version tracking ([f11d068](https://github.com/lbryio/lbry-desktop/commit/f11d06817f0dd75a9c33a7a60150d25d56b66ba0))

## [0.46.0] - [2020-06-08]

### Added

- Can now purchase LBC inside of the app ([#4294](https://github.com/lbryio/lbry-desktop/pull/4294))
- Allow video sharing with start timestamp _community pr!_ ([#4142](https://github.com/lbryio/lbry-desktop/pull/4142))
- Expose reflector status for publishes ([#4148](https://github.com/lbryio/lbry-desktop/pull/4148))
- More tooltip help texts _community pr!_ ([#4185](https://github.com/lbryio/lbry-desktop/pull/4185))
- Add footer on web ([#4159](https://github.com/lbryio/lbry-desktop/pull/4159))
- Support drag-and-drop file publishing _community pr!_ ([#4170](https://github.com/lbryio/lbry-desktop/pull/4170))
- Add advanced editor for comments _community pr!_ ([#4224](https://github.com/lbryio/lbry-desktop/pull/4224))
- Paid content improvements ([#4234](https://github.com/lbryio/lbry-desktop/pull/4234))
- Add status-bar to display a link's destination _community pr!_ ([#4259](https://github.com/lbryio/lbry-desktop/pull/4259))
- Add Catalan language support ([#4313](https://github.com/lbryio/lbry-desktop/pull/4313))

### Changed

- Updated lbry-sdk to [0.75.0](https://github.com/lbryio/lbry-sdk/releases/tag/v0.75.0)
- Use "grab" cursor on floating player to make it easier to tell you can drag it _community pr!_ ([#4201](https://github.com/lbryio/lbry-desktop/pull/4201))
- Confirm age before viewing mature content on web ([#4233](https://github.com/lbryio/lbry-desktop/pull/4233))
- Pause thumbnail gifs until hover ([#4256](https://github.com/lbryio/lbry-desktop/pull/4256))

### Fixed

- Channel selector alignment on creator analytics page _community pr!_ ([#4157](https://github.com/lbryio/lbry-desktop/pull/4157))
- Fix inconsistent relative-date string for claims, comments, etc. _community pr!_ ([#4172](https://github.com/lbryio/lbry-desktop/pull/4172))
- Error opening certain files with special characters in name #2777 _community pr!_ ([#4161](https://github.com/lbryio/lbry-desktop/pull/4161))
- Comic-book file page shows download button first, and then viewer after download _community pr!_ ([#4161](https://github.com/lbryio/lbry-desktop/pull/4161))
- Only show "start at" on share modal for video/audio _community pr!_ ([#4194](https://github.com/lbryio/lbry-desktop/pull/4194))
- Clear media position after video has played to the end _community pr!_ ([#4193](https://github.com/lbryio/lbry-desktop/pull/4193))
- Text casing on publish page _community pr!_ ([#4186](https://github.com/lbryio/lbry-desktop/pull/4186))
- Some strings not translating properly _community pr!_ ([#4238](https://github.com/lbryio/lbry-desktop/pull/4238))
- Prevents page from scrolling while pressing the spacebar when the miniplayer is out of focus _community pr!_ ([#4204](https://github.com/lbryio/lbry-desktop/pull/4204))
- Fixed some string translations _community pr!_ ([#4238](https://github.com/lbryio/lbry-desktop/pull/4238))
- Fixed Publish page card double border _community pr!_ ([#4254](https://github.com/lbryio/lbry-desktop/pull/4254)

## [0.45.1] - [2020-05-06]

### Added

- Channel content preview on custom invite link page _community pr!_ ([#4040](https://github.com/lbryio/lbry-desktop/pull/4040))
- Add Tooltips To Channel Action Buttons _community pr!_ ([#4090](https://github.com/lbryio/lbry-desktop/pull/4090))
- Reenabled repost hiding with corresponding repost email suppression ([#4025](https://github.com/lbryio/lbry-desktop/pull/4025))
- Enabled embeds in markdown posts ([#4060](https://github.com/lbryio/lbry-desktop/pull/4060))
- Save media position in video viewer _community pr!_ ([#4104](https://github.com/lbryio/lbry-desktop/pull/4104))

### Changed

- Updated lbry-sdk to [0.72.0](https://github.com/lbryio/lbry-sdk/releases/tag/v0.72.0)
- Show 'elapsed/total' instead of countdown timer on video player _community pr!_ ([#4049](https://github.com/lbryio/lbry-desktop/pull/4049))
- Modified app strings about wallet backup, to emphasize that the wallet also controls claims _community pr!_ ([#4056](https://github.com/lbryio/lbry-desktop/pull/4056))
- Add confirmation when sending tip respecting "Purchase and Tip Confirmation" (formerly "Purchase Confirmation") setting, now visible in lbry.tv _community pr!_ ([#4051](https://github.com/lbryio/lbry-desktop/pull/4051))
- Hyperlinks in markdown now open in new tab _community pr!_ ([#4111](https://github.com/lbryio/lbry-desktop/pull/4111))

### Fixed

- Better deleted text file handling - will now redownload the file ([#4109](https://github.com/lbryio/lbry-desktop/pull/4109))
- Fixed the title of the subscribe button getting out of sync on fast hover movements _community pr!_ ([#4054](https://github.com/lbryio/lbry-desktop/pull/4054))
- Handle errors better on the creator analytics page and add a new card for stats on users most recent content ([#4043](https://github.com/lbryio/lbry-desktop/pull/4043))
- Add fallback when images fail to load _community pr!_ ([#4019](https://github.com/lbryio/lbry-desktop/pull/4019))
- Fetch new content when clicking LBRY logo while on homepage _community pr!_ ([#4031](https://github.com/lbryio/lbry-desktop/pull/4031))
- Aligns text across browsers and desktop _community pr!_ ([#4050](https://github.com/lbryio/lbry-desktop/pull/4050))
- Reselect channel as "replying as" when switching channels _community pr!_ ([#3926](https://github.com/lbryio/lbry-desktop/issues/3926))

## [0.45.0] - [2020-04-21]

### Added

- Password login with lbry.tv - [Blog post](https://open.lbry.com/@lbry:3f/passwords-on-lbrytv:2) ([#3960](https://github.com/lbryio/lbry-desktop/pull/3960))
- Double confirmation to prevent accidentally deleting a channel ([#3958](https://github.com/lbryio/lbry-desktop/pull/3958))
- Button to unlock all tips for a claim ([#3933](https://github.com/lbryio/lbry-desktop/pull/3933))

### Changed

- Updated lbry-sdk to [0.69.1](https://github.com/lbryio/lbry-sdk/releases/tag/v0.69.1)
- Improved file page layout/styling ([#3918](https://github.com/lbryio/lbry-desktop/pull/3918))
- Now using Github for auto-update downloads ([#3992](https://github.com/lbryio/lbry-desktop/pull/3992))
- Now paginating wallet history using txo_list ([#3979](https://github.com/lbryio/lbry-desktop/pull/3979))

### Fixed

- Images were sometimes cut off depending on screen size _community pr!_ ([#3991](https://github.com/lbryio/lbry-desktop/pull/3991))
- Error styling on repost modal ([#3943](https://github.com/lbryio/lbry-desktop/pull/3943))
- Fix glitchy "follow" button _community pr!_ ([#3963](https://github.com/lbryio/lbry-desktop/pull/3963))

## [0.44.0] - [2020-04-01]

### Added

- Comment replies ([#3864](https://github.com/lbryio/lbry-desktop/pull/3864))
- Display repost count on file pages with link to all reposts of that claim ([#3862](https://github.com/lbryio/lbry-desktop/pull/3862))
- New creator analytics dashboard ([#3857](https://github.com/lbryio/lbry-desktop/pull/3857))
- Better confirmation before deleting channels ([#3835](https://github.com/lbryio/lbry-desktop/pull/3835))
- More claim information on file and channel pages ([#3831](https://github.com/lbryio/lbry-desktop/pull/3831))

### Changed

- Updated lbry-sdk to [0.67.1](https://github.com/lbryio/lbry-sdk/releases/tag/v0.67.1)
- Add sign out confirmation modal on desktop to explain potential issues with signing into a new account ([#3837](https://github.com/lbryio/lbry-desktop/pull/3837))

### Fixed

- Show proper error message when thumbnail upload fails ([#3837](https://github.com/lbryio/lbry-desktop/pull/3837))
- Don't show reward verification screen again if you click "skip" when viewing it ([#3809](https://github.com/lbryio/lbry-desktop/pull/3809))

## [0.43.4] - [2020-03-10]

### Changed

- Temporarily disabled lbry-format apps over security concerns ([#3824](https://github.com/lbryio/lbry-desktop/pull/3824))

### Fixed

- Links to list view weren't working on the homepage and channel discovery page ([#3810](https://github.com/lbryio/lbry-desktop/pull/3810))
- Valid URL handling in search bar ([#3819](https://github.com/lbryio/lbry-desktop/pull/3819))

## [0.43.3] - [2020-03-06]

### Added

- New/Top/Trending options on Channel pages ([#3768](https://github.com/lbryio/lbry-desktop/pull/3768))
- Encourage following channels through new discovery page on sign in ([#3756](https://github.com/lbryio/lbry-desktop/pull/3756))
- Warnings about incompatible video format and high bitrates ([#3794](https://github.com/lbryio/lbry-desktop/pull/3794))
- Additional filtering options (type / duration) alongside Top/Trending/New ([#3778](https://github.com/lbryio/lbry-desktop/pull/3778))
- Czech and Kannada language support ([#3759](https://github.com/lbryio/lbry-desktop/pull/3759))

### Changed

- Default channel bid to 0.01 LBC and improve publish page warnings around insufficient credits ([#3781](https://github.com/lbryio/lbry-desktop/pull/3781))
- Publish page - limit # of tags, improve wording on tag selection ([#3796](https://github.com/lbryio/lbry-desktop/pull/3796))
- Upgrade Electron-builder and updater to latest version to support libcurl changes ([#3799](https://github.com/lbryio/lbry-desktop/pull/3799))
- Upgrade [LBRY-SDK to 0.63.0](https://github.com/lbryio/lbry-sdk/releases/tag/v0.63.0) to fix Windows UPNP issues

### Fixed

- Some posted comments showing up as anonymous ([#3787](https://github.com/lbryio/lbry-desktop/pull/3787))
- Back/forward mouse navigation on Desktop app ([#3763](https://github.com/lbryio/lbry-desktop/pull/3763))

## [0.43.2] - [2020-02-25]

### Fixed

- Fix for users who synced invalid preference data

## [0.43.1] - [2020-02-25]

### Fixed

- Do not sync invalid preference data ([#3743](https://github.com/lbryio/lbry-desktop/pull/3743))

## [0.43.0] - [2020-02-25]

### Added

- Right click to navigate history on desktop ([#3650](https://github.com/lbryio/lbry-desktop/pull/3650))
- Javanese language support ([#3685](https://github.com/lbryio/lbry-desktop/pull/3685))
- Wallet sync status on the wallet page ([#3720](https://github.com/lbryio/lbry-desktop/pull/3720))
- Channel discovery page ([#3700](https://github.com/lbryio/lbry-desktop/pull/3700))

### Changed

- Updated lbry-sdk to [0.61.0](https://github.com/lbryio/lbry-sdk/releases/tag/v0.61.0)
- Drops support for publishing anonymous comments ([#3705](https://github.com/lbryio/lbry-desktop/pull/3705))
- Don't remember past repost bid amount ([bbd263c](https://github.com/lbryio/lbry-desktop/commit/bbd263c4413935ee4fac7b7b79b7f73b42d9c1f6))

### Fixed

- Download all transactions when exporting from transaction table ([#3692](https://github.com/lbryio/lbry-desktop/pull/3692))

## [0.42.0] - [2020-02-14]

### Added

- Ability to repost claims ([#3663](https://github.com/lbryio/lbry-desktop/pull/3663))
- New page for top claims for a specific claim name ([#3674](https://github.com/lbryio/lbry-desktop/pull/3674))
- Language support for Danish, Romanian, and Urdu ([#3657](https://github.com/lbryio/lbry-desktop/pull/3657))
- Ability to unfollow abandoned channels ([#3636](https://github.com/lbryio/lbry-desktop/pull/3636))

### Changed

- Updated lbry-sdk to [0.59.2](https://github.com/lbryio/lbry-sdk/releases/tag/v0.59.2)
- Improvements to text file layouts ([#3511](https://github.com/lbryio/lbry-desktop/pull/3511))

### Fixed

- Always navigate backwards after deleting and abandoning a claim ([#3642](https://github.com/lbryio/lbry-desktop/pull/3642))

## [0.41.0] - [2020-02-05]

### Added

- Download buttons on file cards ([#3546](https://github.com/lbryio/lbry-desktop/pull/3546))
- Comment edit and delete ([#3453](https://github.com/lbryio/lbry-desktop/pull/3453))
- Basic display of reposts ([#3593](https://github.com/lbryio/lbry-desktop/pull/3593))
- See previous navigation pages when right clicking forward/back buttons ([#3547](https://github.com/lbryio/lbry-desktop/pull/3547))
- Autoplay countdown timer ([#3556](https://github.com/lbryio/lbry-desktop/pull/3556))

### Changed

- Better aria-labels for use with voiceover apps ([#3588](https://github.com/lbryio/lbry-desktop/pull/3588))

### Fixed

- Prevent spacebar from toggling fullscreen on Firefox ([#3546](https://github.com/lbryio/lbry-desktop/pull/3546))
- Context menu not working properly in some cases ([#3604](https://github.com/lbryio/lbry-desktop/pull/3604))
- Don't autoplay paid content or content from blocked channels ([#3570](https://github.com/lbryio/lbry-desktop/pull/3570))
- Make claim previews right clickable ([#3631](https://github.com/lbryio/lbry-desktop/pull/3631))

## [0.39.1] - [2020-01-24]

### Added

- Analytics event for video buffering for easier debugging ([#3534](https://github.com/lbryio/lbry-desktop/pull/3534))

### Fixed

- Home page tiles not loading in some cases ([#3539](https://github.com/lbryio/lbry-desktop/pull/3539))
- Spellcheck not working on the advanced publish description ([c6230ba](https://github.com/lbryio/lbry-desktop/commit/c6230ba024a1e1e84ea2be32aff234027cbb02d5))

## [0.39.0] - [2020-01-22]

### Added

- Adds the ability for users to update & delete comments ([#3453](https://github.com/lbryio/lbry-desktop/pull/3453))
- New homepage design ([#3508](https://github.com/lbryio/lbry-desktop/pull/3508))
- Revamped invites system ([#3462](https://github.com/lbryio/lbry-desktop/pull/3462))
- Appimage support ([#3497](https://github.com/lbryio/lbry-desktop/pull/3497))
- Better layout for viewing text files ([#3446](https://github.com/lbryio/lbry-desktop/pull/3446))
- Show file as the thumbnail for free image claims ([#3317](https://github.com/lbryio/lbry-desktop/pull/3317))

### Changed

- Navigation redesign ([#3432](https://github.com/lbryio/lbry-desktop/pull/3432))
- Move away from keychain and into a cookie for authentication ([#3497](https://github.com/lbryio/lbry-desktop/pull/3497))
- Updated lbry-sdk to [0.54.1](https://github.com/lbryio/lbry-sdk/releases/tag/v0.54.1) for faster wallet syncing and improved stability

### Fixed

- Don't show edit screen for other channels ([#3470](https://github.com/lbryio/lbry-desktop/pull/3470))
- Clear publish form when clicking "New Publish" ([#3463](https://github.com/lbryio/lbry-desktop/pull/3463))
- Hide cursor on fullscreen videos ([#3458](https://github.com/lbryio/lbry-desktop/pull/3458))
- Force color profile to render correct colors ([#3456](https://github.com/lbryio/lbry-desktop/pull/3456))
- Video viewer not resizing properly ([#3427](https://github.com/lbryio/lbry-desktop/pull/3427))
- Don't reset publish language to app language ([#261](https://github.com/lbryio/lbry-redux/pull/261))
- Same file wasn't able to be reselected on publish after clearing the publish screen ([#3500](https://github.com/lbryio/lbry-desktop/pull/3500))
- Make sure search results on channel page don't return content from other channels ([#3503](https://github.com/lbryio/lbry-desktop/pull/3503))

## [0.38.2] - [2019-12-21]

### Fixed

- Always sync prefernces on startup
- App no longer crashes on edits in some cases
- Sign in will no longer get stuck

## [0.38.0] - [2019-12-20]

### Fixed

- Issue with adding tags on publishes ([#3375](https://github.com/lbryio/lbry-desktop/pull/3375))

### Added

- Dedicated Channel Creation page ([#3305](https://github.com/lbryio/lbry-desktop/pull/3305))
- Ability to use custom wallet servers ([#3361](https://github.com/lbryio/lbry-desktop/pull/3361))
- Autoplay free text files ([#3357](https://github.com/lbryio/lbry-desktop/pull/3357))

### Changed

- Updated lbry-sdk to [0.50.0](https://github.com/lbryio/lbry-sdk/releases/tag/v0.50.0)
- Always round down dates on claim previews for better yotube parity ([#3353](https://github.com/lbryio/lbry-desktop/pull/3353))

## [0.37.2] - [2019-11-21]

### Fixed

- Channel pages not showing any page numbers ([#3237](https://github.com/lbryio/lbry-desktop/pull/3237))
- Context menu does not open in the webapp when right-clicking video tiles ([#3135](https://github.com/lbryio/lbry-desktop/pull/3135))
- Undefined tags prevents homepage from loading ([#3146](https://github.com/lbryio/lbry-desktop/pull/3146))

### Added

- Setting to start the app minimized when you login (Linux/Windows only) ([#3236](https://github.com/lbryio/lbry-desktop/pull/3236))
- Search on downloads page ([#2969](https://github.com/lbryio/lbry-desktop/pull/2969))
- Clear support state when clearing cache in settings([#3149](https://github.com/lbryio/lbry-desktop/pull/3149))
- Allow disabling app updates for some linux based builds ([#3206](https://github.com/lbryio/lbry-desktop/pull/3206))
- Add French, Turkish, Slovak, and Chinese language support and improved how we are loading languages ([#3180](https://github.com/lbryio/lbry-desktop/pull/3180))

### Changed

- Updated lbry-sdk to [0.46.1](https://github.com/lbryio/lbry-sdk/releases/tag/v0.46.1)
- Optimized SDK calls for faster app startup and performance ([#3216](https://github.com/lbryio/lbry-desktop/pull/3216))

## [0.37.1] - [2019-10-22]

### Fixed

- Wallet unlocking for YouTube Sync users with encrypted wallets ([#2566](https://github.com/lbryio/lbry-sdk/pull/2566))

- Syncing with no password when account first created on LBRY Android ([#3103](https://github.com/lbryio/lbry-desktop/pull/3103))

- Only show channel search bar on the content tab ([#3083](https://github.com/lbryio/lbry-desktop/pull/3083))

### Changed

- Upgrade to [LBRY SDK 0.43.3](https://github.com/lbryio/lbry-sdk/releases/tag/v0.43.3) to support above scenarios

## [0.37.0] - [2019-10-17]

### Fixed

- Escape the generated link for tags ([#2984](https://github.com/lbryio/lbry-desktop/pull/2984))
- Toggle fullscreen when pressing `f` ([#2159](https://github.com/lbryio/lbry-desktop/issues/2159))
- Can't exit full-screen from embedded content with key `F11` ([#2514](https://github.com/lbryio/lbry-desktop/issues/2514))
- Markdown rendering issues with LBRY URLs and channel mentions ([#2928](https://github.com/lbryio/lbry-desktop/issues/2928))
- Incorrect styles of tooltip on dark theme ([#3031](https://github.com/lbryio/lbry-desktop/issues/3031))
- Code tag not formatting content on markdown preview ([#3027](https://github.com/lbryio/lbry-desktop/issues/3027))
- Missing tooltip on channel mention ([#3036](https://github.com/lbryio/lbry-desktop/issues/3036))
- Fix gap between video player and background [(#3025)](https://github.com/lbryio/lbry-desktop/issues/3025)
- Don't allow price to change from scrollwheel [(#3042)](https://github.com/lbryio/lbry-desktop/issues/3042)

### Added

- Comment Thumbnails ([#3108](https://github.com/lbryio/lbry-desktop/pull/3108))

- Syncing between other wallets is now supported for existing users ([#3058](https://github.com/lbryio/lbry-desktop/pull/3058))

- Keyboard shortcuts for the following actions: ([#2999](https://github.com/lbryio/lbry-desktop/pull/2999))

  - `→` to Seek Forward
  - `←` to Seek Backward
  - `f` to Going Fullscreen
  - `m` to Mute/Unmute

- Ability to add multiple tags at once with commas ([#2833](https://github.com/lbryio/lbry-desktop/pull/2833))
- Disable GIF animation unless user hovers ([#2986](https://github.com/lbryio/lbry-desktop/pull/2986))
- Add keyboard shortcuts to toggle player fullscreen: ([#3015](https://github.com/lbryio/lbry-desktop/pull/3015))

  - `f` or `f11` to toggle player fullscreen mode

- Markdown preview for comments: ([#2986](https://github.com/lbryio/lbry-desktop/pull/2986))
  - Basic text formatting (bold, italic, strike)
  - LBRY URLs preview and channel mentions
  - Implement URL embedding in comments
  - Code blocks, inline code and blockquotes
  - Embed Images and GIFs

### Changed

- Refactor ModalAutoUpdateConfirm into ModalAutoUpdateDownloaded ([#2959](https://github.com/lbryio/lbry-desktop/pull/2959))

## [0.36.1] - [2019-10-11]

### Added

- Notarized Mac OSX installer to support the Catalina upgrade ([#3014](https://github.com/lbryio/lbry-desktop/issues/3014))

### Fixed

- LBRY.tv share URL missing a slash, preventing opening on web ([#2995](https://github.com/lbryio/lbry-desktop/issues/2995))

## [0.36.0] - [2019-10-4]

### Added

- Channels page above Publishes which lists all your channels ([#2925](https://github.com/lbryio/lbry-desktop/pull/2925))
- YouTube channel claiming and transfer ([#2925](https://github.com/lbryio/lbry-desktop/pull/2925)). See our [YouTube FAQ](https://lbry.com/faq/youtube) for more information.
- New user sign in flow now includes automatic redeeming of 1 LBC and channel creation ([#2925](https://github.com/lbryio/lbry-desktop/pull/2925))
- Ability to save wallet encryption password ([#2925](https://github.com/lbryio/lbry-desktop/pull/2925))
- Sync your balance (only for users with new wallets) and preferences (subscriptions and tags) between devices ([#2925](https://github.com/lbryio/lbry-desktop/pull/2925)). See our [FAQ for more information](https://lbry.com/faq/account-sync)
- Max character count on comments ([#2944](https://github.com/lbryio/lbry-desktop/pull/2944))
- Subscription and file view counts ([#2920](https://github.com/lbryio/lbry-desktop/pull/2920))
- Pagination on Library, Publishes, and Transactions page ([#2923](https://github.com/lbryio/lbry-desktop/pull/2923))
- Volume setting is now saved between videos ([#2934](https://github.com/lbryio/lbry-desktop/pull/2934))
- Granular balance information on wallet page - includes LBC locked in tips/claims/supports ([#2916](https://github.com/lbryio/lbry-desktop/pull/2916))
- Acknowledgement of [terms of service](https://lbry.com/termsofservice) and age verification on sign in ([#2925](https://github.com/lbryio/lbry-desktop/pull/2925))
- Hidden NSFW content message on tag search results page ([#3038](https://github.com/lbryio/lbry-desktop/pull/3038))

### Changed

- Upgrade LBRY SDK to [0.42.1](https://github.com/lbryio/lbry-sdk/releases/tag/v0.42.1) to improve overall connectivity
- Sign out now clears the email address and refreshes the app ([#2925](https://github.com/lbryio/lbry-desktop/pull/2925))
- Language strings are now pulled dynamically instead of requiring new app releases for better language support ([#2883](https://github.com/lbryio/lbry-desktop/pull/2883))
- Minor design improvements to styles and cards

### Fixed

- Not being able to abandon claims not which weren't downloaded ([#2945](https://github.com/lbryio/lbry-desktop/pull/2945))
- Duration not showing for audio ([#2936](https://github.com/lbryio/lbry-desktop/pull/2936))

## [0.35.7] - [2019-09-24]

### Fixed

- Fixes app crash for some users

## [0.35.6] - [2019-09-23]

### Fixed

- Paid content can now be purchased successfully

## [0.35.4] - [2019-09-22]

# Notes

This release includes a breaking change that will reset many of your settings. This was required to get settings on lbry.tv to work properly. Sorry.

### Added

- Searching on channel pages! ([#2887](https://github.com/lbryio/lbry-desktop/pull/2887))

### Changed

- Upgrade LBRY SDK to [0.40.1](https://github.com/lbryio/lbry-sdk/releases/tag/v0.40.1) to improve connectivity
- Storage of local settings ([#2895](https://github.com/lbryio/lbry-desktop/pull/2895))

### Fixed

- Autoplay next related content ([#2901](https://github.com/lbryio/lbry-desktop/pull/2901))
- Ensure view counted before checking rewards ([#2898](https://github.com/lbryio/lbry-desktop/pull/2898))
- App crash on German language setting ([#2856](https://github.com/lbryio/lbry-desktop/issues/2856))
- Rewards display issue ([#2871](https://github.com/lbryio/lbry-desktop/issues/2871))
- Display issue with upgrade banner on file page ([#2826](https://github.com/lbryio/lbry-desktop/issues/2826))
- Prevent duplicate tags being added to a publish ([#2817](https://github.com/lbryio/lbry-desktop/issues/2817))
- Reset page correctly on app refresh ([#2881](https://github.com/lbryio/lbry-desktop/pull/2881))

## [0.35.3] - [2019-09-04]

### Added

- Allow easy thumbnail upload with video on file edits ([#2816](https://github.com/lbryio/lbry-desktop/pull/2816))
- Better message for unsupported file types ([#2834](https://github.com/lbryio/lbry-desktop/pull/2834))
- Support for daily reward (not live yet) ([#2849](https://github.com/lbryio/lbry-desktop/issues/2849))

### Fixed

- Canonical URL bugs on home and channel pages ([#2829](https://github.com/lbryio/lbry-desktop/issues/2829))
- Crash when clicking a channel in "Find New Channels" ([#2825](https://github.com/lbryio/lbry-desktop/issues/2825))
- SVG and lbry file types not showing correctly ([#2830](https://github.com/lbryio/lbry-desktop/issues/2830)) / ([#2827](https://github.com/lbryio/lbry-desktop/issues/2827))
- Channel not re-selected on edit ([#2828](https://github.com/lbryio/lbry-desktop/issues/2828))
- Command + A support on mac to select all text in an input ([#2837](https://github.com/lbryio/lbry-desktop/pull/2837))
- Search bar getting stuck in focus ([#2500](https://github.com/lbryio/lbry-desktop/pull/2500))

### Changed

- Upgraded [lbry-sdk to 0.40.0](https://github.com/lbryio/lbry-sdk/releases/tag/v0.40.0) to improve wallet syncing and overall connectivity

## [0.35.2] - [2019-08-30]

### Added

- Tips and supports on Channel pages ([#2821](https://github.com/lbryio/lbry-desktop/pull/2821))
- Choose when you want automatic dark mode to take effect ([#2747](https://github.com/lbryio/lbry-desktop/pull/2747))

### Fixed

- Don't show block button on your own channel ([#2744](https://github.com/lbryio/lbry-desktop/pull/2744))
- App crash when automatically playing content originally priced in USD ([b347d3fc](https://github.com/lbryio/lbry-desktop/commit/b347d3fc5b492641124d763625e626a340916cb2))
- Bid amount required on publish page ([#2783](https://github.com/lbryio/lbry-desktop/issues/2783))
- Fixed subscription auto downloads ([#2767](https://github.com/lbryio/lbry-desktop/issues/2767))
- Crash with query strings ([#2733](https://github.com/lbryio/lbry-desktop/issues/2733))
- Autoplay on paid content ([#2762](https://github.com/lbryio/lbry-desktop/issues/2762))

### Changed

- URL format to include both channel and claim short IDs ([#2748](https://github.com/lbryio/lbry-desktop/pull/2748))
- Upgraded [lbry-sdk to 0.39.0](https://github.com/lbryio/lbry-sdk/releases/tag/v0.39.0) for performance and reliability improvements
- Upgraded windows certificate so builds continue to be signed properly ([b9bf861b](https://github.com/lbryio/lbry-desktop/commit/b9bf861b5ca2f7209ce54088732bc8e0e7548514))
- DMCA blocking to include channels ([#2802](https://github.com/lbryio/lbry-desktop/issues/2802))

## [0.35.1] - [2019-08-16]

### Fixed

- Unable to upload thumbnail on publish page ([cad067ad](https://github.com/lbryio/lbry-desktop/commit/cad067ad95ea885db0fc58df3437989298bf5160))

## [0.35.0] - [2019-08-15]

### Fixed

- Add startup statuses back to splash screen ([#2721](https://github.com/lbryio/lbry-desktop/issues/2721))
- Ensure 'mature' tag is always visible on claim previews for mature content ([#2720](https://github.com/lbryio/lbry-desktop/issues/2720))

### Added

- New video player ([#2707](https://github.com/lbryio/lbry-desktop/issues/2707))
  - Uses range requests which allow seeking ahead in a video instead of waiting for the file download up to that point
  - Better support video and audio
  - Pop out player to keep browsing the app while watching content
- Ability to block channels ([#2706](https://github.com/lbryio/lbry-desktop/issues/2706))
- Table styling on file pages ([#2717](https://github.com/lbryio/lbry-desktop/issues/2717))
- Option to disable startup animation ([#2721](https://github.com/lbryio/lbry-desktop/issues/2721))

## [0.34.2] - [2019-07-26]

### Fixed

- Library and other pages not displaying correctly in some instances

## [0.34.1] - [2019-07-25]

### Fixed

- Fixed wallet unlock while still syncing transactions
- Fixed invalid character checking on channel and content URLs ([#2661](https://github.com/lbryio/lbry-desktop/issues/2661))
- Upgrade [SDK to 0.38.5](https://github.com/lbryio/lbry-sdk/releases/tag/v0.38.5) to improve download speeds

## [0.34.0] - [2019-07-23]

### Fixed

- Lots of speed, UI, and style improvements
- Content is now sorted correctly by the date it was released

### Changed

- Share content options now use lbry.tv instead of spee.ch ([#2614](https://github.com/lbryio/lbry-desktop/pull/2614))

### Added

- New app design for better [content discovery](https://lbry.com/faq/trending) with infinite scroll ([#2477](https://github.com/lbryio/lbry-desktop/pull/2477))
- First implementation of comments ([#2510](https://github.com/lbryio/lbry-desktop/pull/2510))
- Ability to edit channels with new metadata and tags ([#2584](https://github.com/lbryio/lbry-desktop/pull/2584))
- Tagging content on publish page ([#2593](https://github.com/lbryio/lbry-desktop/pull/2593))
- New loading page ([#2491](https://github.com/lbryio/lbry-desktop/pull/2491))
- Remember file delete preference ([#2132](https://github.com/lbryio/lbry-desktop/pull/2132))
- Experimental setting for sending supports ([#2647](https://github.com/lbryio/lbry-desktop/pull/2647))
- Experimental setting for language with Indonesian and Polish as first translations ([#2539](https://github.com/lbryio/lbry-desktop/pull/2539))
- Short URLs throughout app ([#2614](https://github.com/lbryio/lbry-desktop/pull/2614))
- Wallet backup zipping option on Help page ([#2585](https://github.com/lbryio/lbry-desktop/pull/2585))

## [0.33.1] - [2019-06-12]

### Fixed

- Fix reflector bugs on failed attempts and improve wallet connection with [LBRY SDK patch](https://github.com/lbryio/lbry/releases/tag/v0.37.4)

## [0.33.0] - [2019-06-04]

### Fixed

- Channel page styling ([#2520](https://github.com/lbryio/lbry-desktop/pull/2520))

### Added

- Comic book reader ([#2484](https://github.com/lbryio/lbry-desktop/pull/2484))
- Base functionality for more language support ([#2495](https://github.com/lbryio/lbry-desktop/pull2495))
- Add easy thumbnail selector for videos ([#2492](https://github.com/lbryio/lbry-desktop/pull2492))

## [0.32.2] - [2019-5-20]

### Fixed

- Upgraded LBRY SDK to 0.37.0 for better network stability
- Better error logging

## [0.32.1] - [2019-5-14]

### Fixed

- Fix analytics on desktop ([#2480](https://github.com/lbryio/lbry-desktop/pull/2480))
- Fix text wrapping on file page ([#2480](https://github.com/lbryio/lbry-desktop/pull/2480))

## [0.32.0] - [2019-5-14]

### Fixed

- Updating claims after they are tipped
- Opening html, markdown, and other text documents
- Opening links from open.lbry.com

### Added

- New routing setup to allow lbry.tv to use the browser url bar for navigation ([#2408](https://github.com/lbryio/lbry-desktop/pull/2408))
- Always show new suggested subscriptions ([#2541](https://github.com/lbryio/lbry-desktop/pull/2451))

### Changed

- Remove nested navigation on side bar ([#2399](https://github.com/lbryio/lbry-desktop/pull/2399))

## [0.31.1] - [2019-3-23]

### Fixed

- Long links not wrappng on claim pages ([70df697](https://github.com/lbryio/lbry-desktop/commit/70df697aab56de4278acf9d8535c66409f89d959))

## [0.30.0] - [2019-3-21]

### Added

- Report errors to slack for easier debugging ([#2340](https://github.com/lbryio/lbry-desktop/pull/2340))
- Add viewcount stats to your published content ([#2335](https://github.com/lbryio/lbry-desktop/pull/2335))

### Changed

- Upgrade LBRY SDK to [0.34.0](https://github.com/lbryio/lbry/releases/tag/v0.34.0) to support better analytics and faster file startup
- Minor changes for normalization hardfork ([#2297](https://github.com/lbryio/lbry-desktop/pull/2297))
- New build setup to support lbry.tv ([#2296](https://github.com/lbryio/lbry-desktop/pull/2296))
- Upgrade Electron and Electron builder to the latest version, including initial differential upgrade support for Windows ([#2366](https://github.com/lbryio/lbry-desktop/pull/2366) / [#2296](https://github.com/lbryio/lbry-desktop/pull/2296))
- lbry.io > lbry.com ([#2321](https://github.com/lbryio/lbry-desktop/pull/2321))

### Fixed

- Incorrect snackbar messaging when attempting to navigating to a malformed claim name ([#2336](https://github.com/lbryio/lbry-desktop/pull/2336))

## [0.29.4] - 2019-3-12

### Fixed

- Style issue on phone number collection modal
- White screen when watching videos for some files

## [0.29.3] - 2019-3-7

### Fixed

- Minor style issue with 0 LBC balance on the wallet page

## [0.29.2] - 2019-3-1

### Fixed

- Upgaded lbry-sdk to 0.32.4 to fix startup issue for some users

## [0.29.0] - 2019-2-21

### Added

- Added referral link next to email input ([#2287](https://github.com/lbryio/lbry-desktop/pull/2287))
- Simple search filter options and feedback option ([#2282](https://github.com/lbryio/lbry-desktop/pull/2282))
- Broken heart icon for unsubscribe ([#2272](https://github.com/lbryio/lbry-desktop/pull/2272))

### Changed

- Upgrade LBRY SDK to [0.32.2](https://github.com/lbryio/lbry/releases/tag/v0.32.0) for improved download performance. See [0.31](https://github.com/lbryio/lbry/releases/tag/v0.31.0) for other changes since last app release.
- Styling changes to unify components across projects ([#2279](https://github.com/lbryio/lbry-desktop/pull/2279))

### Fixed

- Inverse button readability on hover ([#2271](https://github.com/lbryio/lbry-desktop/pull/2271))
- Shutdown on app close ([#2283](https://github.com/lbryio/lbry-desktop/pull/2283))
- Startup on GitHub version check failure ([#1744](https://github.com/lbryio/lbry-desktop/issues/1774))
- SDK detection when running manually ([#2258](https://github.com/lbryio/lbry-desktop/issues/2258))

## [0.28.0] - 2019-2-5

### Added

- Support for sandbox games and applications - `lbry://@OpenSourceGames` ([#2178](https://github.com/lbryio/lbry-desktop/pull/2178))
- Call to action on invite page during first run ([#2221](https://github.com/lbryio/lbry-desktop/pull/2221))
- Responsive related content list for smaller screens ([#2226](https://github.com/lbryio/lbry-desktop/pull/2226))
- Autoplay content in list of related files (experimental feature in settings) ([#2235](https://github.com/lbryio/lbry-desktop/pull/2235))
- Support for back/forward mouse navigation on Windows ([#2250](https://github.com/lbryio/lbry-desktop/pull/2250))

### Changed

- Dark theme as default ([#2210](https://github.com/lbryio/lbry-desktop/pull/2210))
- Invite page improvements including increase of reward to 20 LBC / 10 redemptions ([#2256](https://github.com/lbryio/lbry-desktop/pull/2256))
- Less intrusive first run flow, email collection ([#2210](https://github.com/lbryio/lbry-desktop/pull/2210))
- Add icon for your own publishes on cards/tiles ([#2249](https://github.com/lbryio/lbry-desktop/pull/2249))
- Improved Claimed Reward messaging ([#2253](https://github.com/lbryio/lbry-desktop/pull/2253))

### Fixed

- Error message when thumb upload failed ([#2254](https://github.com/lbryio/lbry-desktop/pull/2254))
- Flow errors ([#2213](https://github.com/lbryio/lbry-desktop/pull/2213))
- Video position on previously viewed files ([#2240](https://github.com/lbryio/lbry-desktop/pull/2240))
- Pass download error details on modal ([#2255](https://github.com/lbryio/lbry-desktop/pull/2255))

## [0.27.1] - 2019-01-22

### Fixed

- Channel name overlap on homepage when screen size is small
- Spacing issue/typo on email collection modal

## [0.27.0] - 2019-01-15

### Added

- Auto email confirmation ([#2169](https://github.com/lbryio/lbry-desktop/pull/2169))
- More language options on publish page ([#2201](https://github.com/lbryio/lbry-desktop/pull/2201))

### Changed

- App redesign with shared colors component ([#2144](https://github.com/lbryio/lbry-desktop/pull/2144))
- Upgraded [LBRY SDK 0.30.4](https://github.com/lbryio/lbry/releases/tag/v0.30.4) to improve network stability

### Fixed

- Show delete button on users own claims ([#2147](https://github.com/lbryio/lbry-desktop/pull/2147))
- Fix "copy" icon being cutoff for some users ([2167](https://github.com/lbryio/lbry-desktop/pull/2167))
- Use correct url when copying vanity addresses ([#2168](https://github.com/lbryio/lbry-desktop/pull/2168))
- Rewards table alignment on small screens ([#2197](https://github.com/lbryio/lbry-desktop/pull/2197))
- File thumbnail issues when resiszing screen ([#2193](https://github.com/lbryio/lbry-desktop/pull/2197))

## [0.26.1] - 2018-12-14

### Fixed

- Channel subscribe button on search page ([#2146](https://github.com/lbryio/lbry-desktop/pull/2146))
- Close modal after redeeming reward code ([#2146](https://github.com/lbryio/lbry-desktop/pull/2146))
- Update Electron to prevent segfault on Ubuntu@18.10 ([#2146](https://github.com/lbryio/lbry-desktop/pull/2146))
- Show reward code modal when all rewards are claimed ([#2146](https://github.com/lbryio/lbry-desktop/pull/2146))

## [0.26.0] - 2018-12-12

### Added

- Redemption of custom reward codes via Rewards page ([#1935](https://github.com/lbryio/lbry-desktop/pull/1935))
- Ability to manage email preferences from Help page ([#1929](https://github.com/lbryio/lbry-desktop/pull/1929))
- History tracking to My LBRY menu ([#1846](https://github.com/lbryio/lbry-desktop/pull/1846))
- Gather data for comments support via claim page ([#2095](https://github.com/lbryio/lbry-desktop/pull/2095))
- Allow typing of encryption password without clicking entry box ([#1977](https://github.com/lbryio/lbry-desktop/pull/1977))
- Focus on search bar with {cmd,ctrl} + "l" ([#2003](https://github.com/lbryio/lbry-desktop/pull/2003))
- Support for clickable channel names on explore page headings ([#2023](https://github.com/lbryio/lbry-desktop/pull/2023))
- Relative time and loading placeholder styles on FileCard/FileTile ([#2022](https://github.com/lbryio/lbry-desktop/pull/2022))
- Persistence to Transaction List Filter Selection ([#2048](https://github.com/lbryio/lbry-desktop/pull/2048))
- Subscription improvements ([#2031](https://github.com/lbryio/lbry-desktop/pull/2031))
- Persistence to File List Filter Selections ([#2050](https://github.com/lbryio/lbry-desktop/pull/2050))
- More share options for claim and channel pages ([#2088](https://github.com/lbryio/lbry-desktop/pull/2088) / [#1943](https://github.com/lbryio/lbry-desktop/pull/1943))
- Better error handling on app startup ([#2098](https://github.com/lbryio/lbry-desktop/pull/2098))
- FAQ and links in Report page ([#2103](https://github.com/lbryio/lbry-desktop/pull/2103))

### Changed

- Upgraded to lbrynet v0.30.0 ([#1998](https://github.com/lbryio/lbry-desktop/pull/1998))
- Make tooltip smarter, show full title on hover ([#1979](https://github.com/lbryio/lbry-desktop/pull/1979))
- Channel pages to have 20 items instead of 10 ([#2002](https://github.com/lbryio/lbry-desktop/pull/2002))
- External links to https ([#2016](https://github.com/lbryio/lbry-desktop/pull/2016))
- Simplify FileCard and FileTile component styling ([#2011](https://github.com/lbryio/lbry-desktop/pull/2011))
- Credit card verification messaging ([#2025](https://github.com/lbryio/lbry-desktop/pull/2025))
- Reverse Order & Use System/Location Time/Date ([#2036]https://github.com/lbryio/lbry-desktop/pull/2036))
- Limit file type can be uploaded as thumbnail for publishing ([#2034](https://github.com/lbryio/lbry-desktop/pull/2034))
- Change snackbar notification position to bottom-left ([#2040](https://github.com/lbryio/lbry-desktop/pull/2040))
- Use shared colors from lbryio/color project ([#2045](https://github.com/lbryio/lbry-desktop/pull/2045))
- Remove ToS checkbox ([#2087](https://github.com/lbryio/lbry-desktop/pull/2087))

### Fixed

- Show pending transactions on Overview page, with refresh button ([#2085](https://github.com/lbryio/lbry-desktop/pull/2085))
- Copyright license not being displayed correctly during edits ([#1997](https://github.com/lbryio/lbry-desktop/pull/1997))
- Transactions filter menu collides with transaction table ([#2005](https://github.com/lbryio/lbry-desktop/pull/2005))
- Invite table cutoff with large number of invites ([#1985](https://github.com/lbryio/lbry-desktop/pull/1985))
- History styling on large screens and link issue with claims ([#1999](https://github.com/lbryio/lbry-desktop/pull/1999))
- Satisfy console warnings in publishForm and validation messaging ([#2010](https://github.com/lbryio/lbry-desktop/pull/2010))
- App crashing if invalid characters entered in LBRY URL ([#2026])(https://github.com/lbryio/lbry-desktop/pull/2026))
- File_list call continues indefinitely if a file is removed while downloading ([#2042](https://github.com/lbryio/lbry-desktop/pull/2042))
- Open folder containing log file when Open Log File button is clicked ([#2078](https://github.com/lbryio/lbry-desktop/pull/2078))

## [0.25.1] - 2018-09-18

### Fixed

- Paragraph rendering now properly includes a margin for new paragraphs ([#1939](https://github.com/lbryio/lbry-desktop/pull/1939))
- Alignment of "navigate to page" input next to pagination on channel pages ([#1941](https://github.com/lbryio/lbry-desktop/pull/1941))
- Table spacing with claim name in transactions table ([#1942](https://github.com/lbryio/lbry-desktop/pull/1942))
- Ability to click away from tip screen without the cancel button ([#1944](https://github.com/lbryio/lbry-desktop/pull/1944))
- Disallow invalid tip amounts ([#1947](https://github.com/lbryio/lbry-desktop/pull/1947))
- Ensure we record views for downloaded content from subscriptions and autoplay ([#1962](https://github.com/lbryio/lbry-desktop/pull/1962))

## [0.25.0] - 2018-08-29

### Added

- Wallet encryption/decryption user flows in settings ([#1785](https://github.com/lbryio/lbry-desktop/pull/1785))
- Suggestions for recommended content on file page ([#1845](https://github.com/lbryio/lbry-desktop/pull/1845))
- Auto-download setting for subscriptions ([#1898](https://github.com/lbryio/lbry-desktop/pull/1898))
- Ability to disable desktop notifications ([#1834](https://github.com/lbryio/lbry-desktop/pull/1834))
- Better preview for content ([#620](https://github.com/lbryio/lbry-desktop/pull/620))
- New markdown and docx viewer ([#1826](https://github.com/lbryio/lbry-desktop/pull/1826))
- New viewer for human-readable text files ([#1826](https://github.com/lbryio/lbry-desktop/pull/1826))
- CSV and JSON viewer ([#1410](https://github.com/lbryio/lbry-desktop/pull/1410))
- 3D File viewer features and performance/memory usage improvements ([#1870](https://github.com/lbryio/lbry-desktop/pull/1870))
- Desktop notification when publish is completed ([#1892](https://github.com/lbryio/lbry-desktop/pull/1892))
- FAQ to Publishing Area ([#1833](https://github.com/lbryio/lbry-desktop/pull/1833))
- FAQ to wallet security area ([#1917](https://github.com/lbryio/lbry-desktop/pull/1917))

### Changed

- Upgraded LBRY Protocol to [version 0.21.2](https://github.com/lbryio/lbry/releases/tag/v0.21.2) fixing a download bug
- Searching now shows results by default, including direct lbry:// URL tile ([#1875](https://github.com/lbryio/lbry-desktop/pull/))
- Replaced checkboxes with toggles throughout app ([#1834](https://github.com/lbryio/lbry-desktop/pull/1834))
- Removed price tile when content is Free ([#1845](https://github.com/lbryio/lbry-desktop/pull/1845))
- Pass error message from spee.ch API during thumbnail upload ([#1840](https://github.com/lbryio/lbry-desktop/pull/1840))
- Use router pattern for rendering file viewer ([#1544](https://github.com/lbryio/lbry-desktop/pull/1544))
- Missing word "to" added to the Bid Help Text ([#1854](https://github.com/lbryio/lbry-desktop/pull/1854))
- Updated to electron@2 ([#1858](https://github.com/lbryio/lbry-desktop/pull/1858))

### Fixed

- Node id not being passed correctly ([#1895](https://github.com/lbryio/lbry-desktop/pull/1895))
- Subscription quirks including not loading on startup, sorting, showing new content, and sub blank page ([#1872](https://github.com/lbryio/lbry-desktop/pull/1872))
- Upgrade on Close button not dismissing properly during automated app update ([#1857](https://github.com/lbryio/lbry-desktop/pull/1857))

## [0.24.0] - 2018-08-14

### Fixed

- Issue where the publish page would show "Editing" on a new publish ([#1864](https://github.com/lbryio/lbry-desktop/pull/1864))

### Changed

- Upgrade LBRY Protocol to [version 0.21.1](https://github.com/lbryio/lbry/releases/tag/v0.21.1) which should improve download speed and availability.
- Show label when publish button is disabled while uploading thumbnail to spee.ch ([#1867](https://github.com/lbryio/lbry-desktop/pull/1867))

## [0.23.1] - 2018-08-01

### Fixed

- Fix ShapeShift integration ([#1842](https://github.com/lbryio/lbry-desktop/pull/1842))

## [0.23.0] - 2018-07-25

### Fixed

- **Wallet -> Get Credits** page now shows correct ShapeShift status when it's available ([#1836](https://github.com/lbryio/lbry-desktop/issues/1836))
- Fix middle click link error ([#1843](https://github.com/lbryio/lbry-desktop/issues/1843)}
- Problem with search auto-complete menu when scrolling over file viewer ([#1847](https://github.com/lbryio/lbry-desktop/issues/1847))
- Show label when publish button is disabled while uploading thumbnail to spee.ch ([#1867](https://github.com/lbryio/lbry-desktop/pull/1867))
- Edit option missing from certain published claims ([#1756](https://github.com/lbryio/lbry-desktop/issues/1756))
- Navigation issue with channels that have more than one page ([#1797](https://github.com/lbryio/lbry-desktop/pull/1797))
- Navigation issue with channels that have more than one page ([#1797](https://github.com/lbryio/lbry-desktop/pull/1797))
- Upgrade modals would stack on-top of each other if the app was kept open for a long time ([#1857](https://github.com/lbryio/lbry-desktop/pull/1857))

### Added

- 3D file viewer for OBJ & STL file types ([#1558](https://github.com/lbryio/lbry-desktop/pull/1558))
- Thumbnail preview on publish page ([#1755](https://github.com/lbryio/lbry-desktop/pull/1755))
- Abandoned claim transactions now show in wallet history ([#1769](https://github.com/lbryio/lbry-desktop/pull/1769))
- Emoji support in the claim description ([#1800](https://github.com/lbryio/lbry-desktop/pull/1800))
- PDF preview ([#1576](https://github.com/lbryio/lbry-desktop/pull/1576))

### Changed

- Upgraded LBRY Protocol to [version 0.20.4](https://github.com/lbryio/lbry/releases/tag/v0.20.4) to assist with download availability and lower CPU usage on idle.
- Upgraded Electron-Builder and Updater to support signing the daemon and improving the auto-update process ([#1784](https://github.com/lbryio/lbry-desktop/pull/1784))
- Channel page now uses caching, faster switching between channels/claims ([#1750](https://github.com/lbryio/lbry-desktop/pull/1750))
- Only show video error modal if you are on the video page & don't retry to play failed videos ([#1768](https://github.com/lbryio/lbry-desktop/pull/1768))
- Actually hide NSFW files if a user chooses to hide NSFW content via the settings page ([#1748](https://github.com/lbryio/lbry-desktop/pull/1748))
- Hide the "Community top bids" section if user chooses to hide NSFW content ([#1760](https://github.com/lbryio/lbry-desktop/pull/1760))
- More descriptive error message when Shapeshift is unavailable ([#1771](https://github.com/lbryio/lbry-desktop/pull/1771))
- Rename the Github repo to lbry-desktop ([#1765](https://github.com/lbryio/lbry-desktop/pull/1765))

## [0.22.2] - 2018-07-09

### Fixed

- Fixed 'Get Credits' screen so the app doesn't break when LBC is unavailable on ShapeShift ([#1739](https://github.com/lbryio/lbry-desktop/pull/1739))

## [0.22.1] - 2018-07-05

### Added

### Fixed

- Take previous bid amount into account when determining how much users have available to deposit ([#1725](https://github.com/lbryio/lbry-desktop/pull/1725))
- Sidebar sizing on larger screens ([#1709](https://github.com/lbryio/lbry-desktop/pull/1709))
- Publishing scenario while editing and changing URI ([#1716](https://github.com/lbryio/lbry-desktop/pull/1716))
- Fix can't right click > paste into description on publish ([#1664](https://github.com/lbryio/lbry-desktop/issues/1664))
- Mac/Linux error when starting app up too quickly after shutdown ([#1727](https://github.com/lbryio/lbry-desktop/pull/1727))
- Console errors when multiple downloads for same claim exist ([#1724](https://github.com/lbryio/lbry-desktop/pull/1724))
- App version in dev mode ([#1722](https://github.com/lbryio/lbry-desktop/pull/1722))
- Long URI name displays in transaction list/Help ([#1694](https://github.com/lbryio/lbry-desktop/pull/1694))/([#1692](https://github.com/lbryio/lbry-desktop/pull/1692))

### Changed

- Show claim name, instead of URI, when loading a channel([#1711](https://github.com/lbryio/lbry-desktop/pull/1711))
- Updated LBRY daemon to 0.20.3 which contains some availability improvements ([v0.20.3](https://github.com/lbryio/lbry/releases/tag/v0.20.3))
- Change startup error message to be more specific about repairing install([#1749](https://github.com/lbryio/lbry-desktop/issues/1749))

## [0.22.0] - 2018-06-26

### Added

- Ability to upload thumbnails through spee.ch while publishing ([#1248](https://github.com/lbryio/lbry-desktop/pull/1248))
- QR code for wallet address to Send and Receive page ([#1582](https://github.com/lbryio/lbry-desktop/pull/1582))
- "View on Web" button on file/channel pages with spee.ch link ([#1222](https://github.com/lbryio/lbry-desktop/pull/1222))
- Autoplay downloaded and free media along with toggle ([#584](https://github.com/lbryio/lbry-desktop/pull/1453))
- Ability to get latest claims from channel on homepage (currently inactive) ([#1267](https://github.com/lbryio/lbry-desktop/pull/1267))
- Confirmation prompt when sending credits ([#1525](https://github.com/lbryio/lbry-desktop/pull/1525))
- Ability to right click > copy lbry:// hyperlink on tiles ([#1486](https://github.com/lbryio/lbry-desktop/pull/1486))
- Buttons to open log file and log directory on the help page ([#1556](https://github.com/lbryio/lbry-desktop/issues/1556))
- Ability to resend verification email ([#1492](https://github.com/lbryio/lbry-desktop/issues/1492))
- Keyboard shortcut to quit the app on Windows ([#1202](https://github.com/lbryio/lbry-desktop/pull/1202))
- Build for both architectures (x86 and x64) for Windows ([#1262](https://github.com/lbryio/lbry-desktop/pull/1262))
- Referral FAQ to Invites screen ([#1314](https://github.com/lbryio/lbry-desktop/pull/1314))
- Show exact wallet balance on mouse hover over ([#1305](https://github.com/lbryio/lbry-desktop/pull/1305))
- Pre-fill publish URL after clicking "Put something here" link ([#1303](https://github.com/lbryio/lbry-desktop/pull/1303))
- Danger JS to automate code reviews ([#1289](https://github.com/lbryio/lbry-desktop/pull/1289))
- 'Go to page' input on channel pagination ([#1166](https://github.com/lbryio/lbry-desktop/pull/1166))

### Changed

- LBRY App UI Redesign 5.0 implemented including new theme, layout, and improved search mechanics ([#870](https://github.com/lbryio/lbry-desktop/pull/870)) and ([#1173](https://github.com/lbryio/lbry-desktop/pull/1173))
- Updated LBRY daemon to 0.20.2 which improves speed and reliability. ([v0.20.0](https://github.com/lbryio/lbry/releases/tag/v0.20.0), [v0.20.1](https://github.com/lbryio/lbry/releases/tag/v0.20.1), [v0.20.2](https://github.com/lbryio/lbry/releases/tag/v0.20.2))
- Adapted dark mode to redesign ([#1269](https://github.com/lbryio/lbry-desktop/pull/1269))
- Show latest claims for across all subscribed channel (no longer grouped by channel) and store sub data in internal database ([#1424](https://github.com/lbryio/lbry-desktop/pull/1424))
- New publishes now show as pending on Publishes screen ([#1040](https://github.com/lbryio/lbry-desktop/pull/1040))
- Enhanced flair to snackbar ([#1313](https://github.com/lbryio/lbry-desktop/pull/1313))
- Made font in price badge larger ([#1420](https://github.com/lbryio/lbry-desktop/pull/1420))
- Move rewards logic to internal API ([#1509](https://github.com/lbryio/lbry-desktop/pull/1509))
- Narrative about Feature Request on Help Page and Report Page ([#1551](https://github.com/lbryio/lbry-desktop/pull/1551))

### Fixed

- Create channel and publish immediately([#1481](https://github.com/lbryio/lbry-desktop/pull/1481))
- Price not updated on tile/file page ([#797](https://github.com/lbryio/lbry-desktop/issues/797))
- Markdown rendering support on show page ([#1179](https://github.com/lbryio/lbry-desktop/issues/1179))
- Content address extending outside of visible area ([#741](https://github.com/lbryio/lbry-desktop/issues/741))
- Content-type not shown correctly in file description ([#863](https://github.com/lbryio/lbry-desktop/pull/863))
- Fix [Flow](https://flow.org/) ([#1197](https://github.com/lbryio/lbry-desktop/pull/1197))
- Black screen on macOS after maximizing LBRY and then closing ([#1235](https://github.com/lbryio/lbry-desktop/pull/1235))
- Download percentage indicator overlay ([#1271](https://github.com/lbryio/lbry-desktop/issues/1271))
- Alternate row shading for transactions on dark theme ([#1355](https://github.com/lbryio/lbry-desktop/issues/#1355))
- Don't allow dark mode with automatic night mode enabled ([#1005](https://github.com/lbryio/lbry-desktop/issues/1005))
- Description box on Publish (dark theme) ([#1356](https://github.com/lbryio/lbry-desktop/issues/#1356))
- Price wrapping in price badge ([#1420](https://github.com/lbryio/lbry-desktop/pull/1420))
- Spacing in search suggestions ([#1422](https://github.com/lbryio/lbry-desktop/pull/1422))
- Text/HTML files don't display correctly in-app anymore ([#1379](https://github.com/lbryio/lbry-desktop/issues/1379))
- Notification modals when reward is claimed ([#1436](https://github.com/lbryio/lbry-desktop/issues/1436)) and ([#1407](https://github.com/lbryio/lbry-desktop/issues/1407))
- Disabled cards (grayed out) ([#1466](https://github.com/lbryio/lbry-desktop/issues/1466))
- New lines not showing correctly after markdown changes ([#1504](https://github.com/lbryio/lbry-desktop/issues/1504))
- Claim ID being null when reporting a claim that was not previously downloaded ([PR#1530](https://github.com/lbryio/lbry-desktop/pull/1530))
- URI and outpoint not being passed properly to API ([#1494](https://github.com/lbryio/lbry-desktop/issues/1494))
- Incorrect markdown preview on URL with parentheses ([#1570](https://github.com/lbryio/lbry-desktop/issues/1570))
- Fix Linux upgrade path and add manual installation note ([#1606](https://github.com/lbryio/lbry-desktop/issues/1606))
- Fix can type in unfocused fields while publishing without selecting file ([#1456](https://github.com/lbryio/lbry-desktop/issues/1456))
- Fix navigation button resulting incorrect page designation ([#1502](https://github.com/lbryio/lbry-desktop/issues/1502))
- Fix shouldn't allow to open multiple export and choose file dialogs ([#1175](https://github.com/lbryio/lbry-desktop/issues/1175))

## [0.21.6] - 2018-06-05

### Fixed

- Fix page URLs on app cold start ([#1549](https://github.com/lbryio/lbry-desktop/issues/1549))
- Fix analytics event ([#1494](https://github.com/lbryio/lbry-desktop/issues/1494))

## [0.21.5] - 2018-05-31

### Added

- Ability to navigate to in-app pages via URL ([#1352](https://github.com/lbryio/lbry-desktop/issues/1352))

### Fixed

- Fixed green screen on invalid URL via hyperlink ([#959](https://github.com/lbryio/lbry-desktop/issues/959))
- Fixed crash when lbry-desktop repository is renamed to lbry-desktop ([#1505](https://github.com/lbryio/lbry-desktop/issues/1505))
- Fixed rewards not disappearing after claiming ([596](https://github.com/lbryio/lbry-desktop/issues/596))

### Changed

- Rewards now rely on API data ([#1329](https://github.com/lbryio/lbry-desktop/issues/1329))

## [0.21.4] - 2018-05-10

### Changed

- Update LBRY Protocol to 0.19.3 - faster blockchain header download for new and existing users (See full changelog for [0.19.2](https://github.com/lbryio/lbry/releases/tag/v0.19.2) and [0.19.3](https://github.com/lbryio/lbry/releases/tag/v0.19.3))

### Fixed

- Ability to submit bug reports

## [0.21.3] - 2018-04-23

### Added

- Block blacklisted content ([#1361](https://github.com/lbryio/lbry-desktop/pull/1361))

## [0.21.2] - 2018-03-22

### Added

- Save app state when closing to tray ([#968](https://github.com/lbryio/lbry-desktop/issues/968))
- Added startup-troubleshooting FAQ URL to daemon error ([#1039](https://github.com/lbryio/lbry-desktop/pull/1039))
- Added ability to export wallet transactions to JSON and CSV format ([#976](https://github.com/lbryio/lbry-desktop/pull/976))
- Add Rewards FAQ to LBRY app ([#1041](https://github.com/lbryio/lbry-desktop/pull/1041))
- Notifications when the channel a user subscribes to uploads new content ([#1066](https://github.com/lbryio/lbry-desktop/pull/1066))
- Codacy support for Github contributions ([#1059](https://github.com/lbryio/lbry-desktop/pull/1059))
- App category for Linux ([#877](https://github.com/lbryio/lbry-desktop/pull/877))
- Add YouTube Sync reward ([#1147](https://github.com/lbryio/lbry-desktop/pull/1147))
- Retain previous screen sizing on startup ([#338](https://github.com/lbryio/lbry-desktop/issues/338))

### Changed

- Update LBRY Protocol to 0.19.1 (See changelog for [0.19.0](https://github.com/lbryio/lbry/releases/tag/v0.19.0) and [0.19.1](https://github.com/lbryio/lbry/releases/tag/v0.19.1))
- Improved privacy by allowing users to turn off the file view counter and better understand privacy settings ([#1074](https://github.com/lbryio/lbry-desktop/pull/1074) / [#1116](https://github.com/lbryio/lbry-desktop/pull/1116))
- Disabled auto dark mode if dark mode is selected ([#1006](https://github.com/lbryio/lbry-desktop/pull/1006))
- Refactor Electron's main process ([#951](https://github.com/lbryio/lbry-desktop/pull/951))
- Refactor `lbryuri.js` into separate named exports ([#957](https://github.com/lbryio/lbry-desktop/pull/957))
- Keep node_modules up-to-date when yarn.lock changes due to git ([#955](https://github.com/lbryio/lbry-desktop/pull/955))
- Do not kill an existing daemon, instead check if one exists ([#973](https://github.com/lbryio/lbry-desktop/pull/973))
- Enable play button immediately after user clicks download ([#987](https://github.com/lbryio/lbry-desktop/pull/987))
- Significantly improved search performance ([#1032](https://github.com/lbryio/lbry-desktop/pull/1032))
- Allow editing of claims when bid is greater than current balance ([#1105](https://github.com/lbryio/lbry-desktop/pull/1105))

### Fixed

- Fixed sort by date of published content ([#986](https://github.com/lbryio/lbry-desktop/issues/986))
- Fix night mode start time, set to 9PM ([#1050](https://github.com/lbryio/lbry-desktop/issues/1050))
- Disable drag and drop of files into the app ([#1045](https://github.com/lbryio/lbry-desktop/pull/1045))
- Fixed uninformative error message ([#1046](https://github.com/lbryio/lbry-desktop/pull/1046))
- Update documentation for DevTools and fix some ESLint warnings ([#911](https://github.com/lbryio/lbry-desktop/pull/911))
- Fix right click bug ([#928](https://github.com/lbryio/lbry-desktop/pull/928))
- Fix Election linting errors ([#929](https://github.com/lbryio/lbry-desktop/pull/929))
- App will no longer reset when minimizing to tray ([#1042](https://github.com/lbryio/lbry-desktop/pull/1042))
- Error when clicking LBRY URLs when app is closed on macOS ([#1119](https://github.com/lbryio/lbry-desktop/issues/1119))
- LBRY URLs not working on Linux ([#1120](https://github.com/lbryio/lbry-desktop/issues/1120))
- Fix Windows notifications not showing ([#1145](https://github.com/lbryio/lbry-desktop/pull/1145))
- Fix export issues ([#1163](https://github.com/lbryio/lbry-desktop/pull/1163))

## [0.20.0] - 2018-01-30

### Added

- Added Automatic Dark Mode ([#950](https://github.com/lbryio/lbry-desktop/pull/950))
- Re-introduce build dir / dist dir option for isolated build environments ([#933](https://github.com/lbryio/lbry-desktop/pull/933))
- Added SMS as a method for reward identity verification ([#946](https://github.com/lbryio/lbry-desktop/pull/946))
- Added auto-update ([#808](https://github.com/lbryio/lbry-desktop/pull/808))

### Changed

- Refactored Electron's main process ([#951](https://github.com/lbryio/lbry-desktop/pull/951))
- Refactored lbryuri.js into separate named exports ([#957](https://github.com/lbryio/lbry-desktop/pull/957))
- Upgraded Daemon to [version 18.2](https://github.com/lbryio/lbry/releases/tag/v0.18.2) ([#961](https://github.com/lbryio/lbry-desktop/pull/961))
- Upgraded Electron for security patch ([commit](https://github.com/lbryio/lbry-desktop/commit/48cc82b86d79ea35e3c529b420957d9dd6043209))

### Fixed

- Fixed issues in documentation ([#945](https://github.com/lbryio/lbry-desktop/pull/945))
- Fixed linting errors ([#929](https://github.com/lbryio/lbry-desktop/pull/929))

## [0.19.4] - 2018-01-08

### Added

- Video state tracking in Redux - developer only ([#890](https://github.com/lbryio/lbry-desktop/pull/890))

### Changed

- Improved text content in app ([#921](https://github.com/lbryio/lbry-desktop/pull/921))

### Fixed

- Right click works in the app again ([#928](https://github.com/lbryio/lbry-desktop/pull/928))
- Icons are now the rights size ([#925](https://github.com/lbryio/lbry-desktop/pull/925))
- Fixed tip sending error ([#918](https://github.com/lbryio/lbry-desktop/pull/918))
- Newly created channel immediately available for publishing

## [0.19.3] - 2017-12-30

### Changed

- Improved internal code structuring by adding linting integration -- developers only ([#891](https://github.com/lbryio/lbry-desktop/pull/891))
- Improved developer documentation ([#910](https://github.com/lbryio/lbry-desktop/pull/910))

### Removed

- Removed email verification reward ([#914](https://github.com/lbryio/lbry-desktop/pull/921))

### Fixed

- Added snackbar text in place where it was coming up blank ([#902](https://github.com/lbryio/lbry-desktop/pull/902))

## [0.19.2] - 2017-12-22

### Added

- Added copy address button to the Wallet Address component on Send / Receive ([#875](https://github.com/lbryio/lbry-desktop/pull/875))
- Link to creators’ channels on homepage ([#869](https://github.com/lbryio/lbry-desktop/pull/869))
- Pause playing video when file is opened ([#880](https://github.com/lbryio/lbry-desktop/pull/880))
- Add captcha to verification process ([#897](https://github.com/lbryio/lbry-desktop/pull/897))

### Changed

- Contributor documentation ([#879](https://github.com/lbryio/lbry-desktop/pull/879))

### Fixed

- Linux app categorization ([#877](https://github.com/lbryio/lbry-desktop/pull/877))

## [0.19.1] - 2017-12-13

### Added

- Added empty rewards message on overview page ([#847](https://github.com/lbryio/lbry-desktop/pull/847))

### Changed

- Updated developer tools and restructured code ([#861](https://github.com/lbryio/lbry-desktop/pull/861) / [#862](https://github.com/lbryio/lbry-desktop/pull/862))

### Fixed

- Fixed typos ([#845](https://github.com/lbryio/lbry-desktop/pull/845) / [#846](https://github.com/lbryio/lbry-desktop/pull/846))
- Fixed theme-related error while running in development ([#865](https://github.com/lbryio/lbry-desktop/pull/865))
- Fixed build/signing error on Windows ([#864](https://github.com/lbryio/lbry-desktop/pull/864))

## [0.19.0] - 2017-12-11

### Added

- [Subscriptions](https://github.com/lbryio/lbry-desktop/issues/715). File and channel pages now show a subscribe button. A new "Subscriptions" tab appears on the homepage shows the most recent content from subscribed channels.
- [LBC acquisition widget](https://github.com/lbryio/lbry-desktop/issues/609). Convert other popular Cryptocurrencies into LBC via a ShapeShift integration.
- [Flow](https://flow.org/) static type checking. This is a dev-only feature, but will make development faster, less error prone, and better for newcomers.

### Changed

- The first run process for new users has changed substantially. New users can now easily receive one credit.
- The wallet area has been re-organized. Send and Receive are now on the same page. A new page, "Get Credits", explains how users can add LBRY credits to the app.
- Significant structural changes to code organization, packaging, and building. The app now follows a typical electron folder structure. All 3 `package.json` files have been reduced to a single file. Redux-related code was moved into it's own subfolder.
- The macOS docking icon has been improved.
- The prompt for an insufficient balance is much more user-friendly.
- The credit balance displayed in the main app navigation displays two decimal places instead of one.
- Video download error messages are now more understandable.([#328](https://github.com/lbryio/lbry-desktop/issues/328))
- Windows path to the daemon/CLI executables changed to: `C:\Program Files (x86)\LBRY\resources\static\daemon`

### Deprecated

- We previous had two separate modals for insufficient credits. These have been combined.

### Fixed

- Long channel names causing inconsistent thumbnail sizes ([#721](https://github.com/lbryio/lbry-desktop/issues/721))
- Channel names in pages are highlighted to indicate them being clickable ([#814](https://github.com/lbryio/lbry-desktop/issues/814))
- Fixed the transaction screen not loading for brand new users ([#755](https://github.com/lbryio/lbry-desktop/issues/755))
- Fixed issues with scrolling and back and forward navigation ([#729](https://github.com/lbryio/lbry-desktop/issues/729))
- Fixed sorting by title for published files ([#614](https://github.com/lbryio/lbry-desktop/issues/614))
- App now uses the new `balance_delta` field provided by the LBRY API ([#611](https://github.com/lbryio/lbry-desktop/issues/611))
- Abandoning from the claim page now works.([#883](https://github.com/lbryio/lbry-desktop/issues/833))

## [0.18.2] - 2017-11-15

### Fixed

- Email verification is fixed. (#746)

## [0.18.0] - 2017-11-13

### Added

- Trending! The landing page of the app now features content that is surging in popularity relative to past interest.
- The app now closes to the system tray. This will help improve publish seeding and network performance. Directing the app to quit or exit will close it entirely. (#374)
- You can now revoke past publishes to receive your credits. (#581)
- You can now unlock tips sent to you so you can send them elsewhere or spend them. (#581)
- Added new window menu options for reloading and help.
- Rewards are now marked in transaction history (#660)

### Changed

- Daemon updated to [v0.18.0](https://github.com/lbryio/lbry/releases/tag/v0.18.0). The largest changes here are several more network improvements and fixes as well as functionality and improvements related to concurrent heavier usage (bugs and issues largely discovered by spee.ch).
- Improved build and first-run process for new developers.
- Replaced all instances of `XMLHttpRequest` with native `Fetch` API (#676).

### Fixed

- Fixed console errors on settings page related to improper React input properties.
- Fixed modals being too narrow after font change (#709)
- Fixed bug that prevented new channel and first publish rewards from being claimed (#290)

## [0.17.1] - 2017-10-25

### Changed

- Updated daemon to 0.17.1. 0.17.1 contains several more download fixes that are backwards incompatible, making this a near mandatory upgrade.
- Continuing to standardize and improve design. File selectors, checkboxes, radios, and a number of other elements got substantial improvements.
- [Electron](https://github.com/electron/electron) version upgraded. Most relevantly, this fixes URI handling in Linux.
- Chat links and text updated to remove references to Slack.

### Fixed

- Fixed handling of empty search results.
- Fixed minimum channel length name (#689).

## [0.17.0] - 2017-10-12

### Added

- Added a new search service. Significantly improved search results.
- Channels now appear in search results. Channel cards to be improved soon?.
- Add setting to automatically purchase low-cost content without a confirmation dialog.
- New custom styled scrollbar (#574)
- New tabs (#576).

### Changed

- LBRY protocol upgraded from v0.16.1 to [v0.17](https://github.com/lbryio/lbry/releases/tag/v0.17.0). Significant improvements to download performance anticipated.
- Improved Discover page load time by batching all URIs into one API call.
- Changed the File page to make it clearer how to open the folder for a file.
- Display search bar on discover page instead of title and remove duplicated icon.
- Minor update for themes.
- There is no longer a minimum channel length (#645)
- Changed the File page to make it clearer how to open the folder for a file
- The upgrade message is now friendlier and includes a link to the release notes.
- Local settings refactored and no longer intermixed with LBRY API library.

### Fixed

- Improve layout (and implementation) of the icon panel in file tiles and cards
- The folder icon representing a local download now shows up properly on Channel pages (#587)
- While editing a publish, the URL will no longer change if you select a new file. (#601)
- Fixed issues with opening the folder for a file (#606)
- Be consistent with the step property on credit inputs (#604)
- Fixed unresponsive header (#613)
- Fixed dark theme issues with text content.
- Minor CSS fixes.
- Fixed issue when file fails to download (#642)
- Fixed issue after accessing a video without enough credits (#605)
- Fixed channel fetching without claims (#634)

## [0.16.0] - 2017-09-21

### Added

- Added a tipping button to send LBRY Credits to a creator.
- Added an edit button on published content. Significantly improved UX for editing claims.
- Added theme settings option and new Dark theme.
- Significantly more detail is shown about past transactions and new filtering options for transactions.
- File pages now show the time of a publish.
- The "auth token" displayable on Help offers security warning
- Added a new component for rendering dates and times. This component can render the date and time of a block height, as well.
- Added a `Form` component, to further progress towards form sanity.
- Added `gnome-keyring` dependency to .deb

### Changed

- CSS significantly refactored to support CSS vars (and consequently easy theming).

### Fixed

- URLs on cards no longer wrap and show an ellipsis if longer than one line.

## [0.15.1] - 2017-09-08

### Added

- File pages now show the time of a publish. This includes a new component for rendering dates and times that can render the date and time of a block height, as well.

### Changed

- Updated to daemon [0.15.2](https://github.com/lbryio/lbry/releases/tag/v0.15.2) to prevent a bug in USD purchases.

### Fixed

- Potential fix for blank error popup when streaming (#536)
- Fixed some popups showing improperly while balance was loading (#534)
- Show a security warning when the auth token is displayed on Help.
- Some CSS changes to prevent the card row from clipping the scroll arrows after the window width is reduced below a certain point
- Clearly notify user when they try to send credits to an invalid address (#445)

## [0.15.0] - 2017-08-31

### Added

- Added an Invites area inside of the Wallet. This allows users to invite others and shows the status of all past invites (including all invite data from the past year). Up to one referral reward can now be claimed, but only if both users have passed the humanity test.
- Added new summary components for rewards and invites to the Wallet landing page.
- Added a forward button and improved history behavior. Back/forward disable when unusable.
- Added past history of rewards to the rewards page.
- Added wallet backup guide reference.
- Added a new widget for setting prices (`FormFieldPrice`), used in Publish and Settings.

### Changed

- Updated to daemon [0.15](https://github.com/lbryio/lbry/releases). Most relevant changes for app are improved announcing of content and a fix for the daemon getting stuck running.
- Significant refinements to first-run process, process for new users, and introducing people to LBRY and LBRY credits.
- Changed Wallet landing page to summarize status of other areas. Refactored wallet and transaction logic.
- Added icons to missing page, improved icon and title logic.
- Changed the default price settings for priced publishes.
- When an "Open" button is clicked on a show page, if the file fails to open, the app will try to open the file's folder.
- Updated several packages and fixed warnings in build process (all but the [fsevents warning](https://github.com/yarnpkg/yarn/issues/3738), which is a rather dramatic debate)
- Some form field refactoring as we take baby steps towards form sanity.
- Replaced confusing placeholder text from email input.
- Refactored modal and settings logic.
- Refactored history and navigation logic.

### Removed

- Removed the label "Max Purchase Price" from settings page. It was redundant.
- Unused old files from previous commit(9c3d633)

### Fixed

- Tiles will no longer be blurry on hover (Windows only bug)
- Removed placeholder values from price selection form fields, which was causing confusion that these were real values (#426)
- Fixed showing "other currency" help tip in publish form, which was caused due to not "setting" state for price
- Publish page now properly checks for all required fields are filled
- Fixed sizing on squat videos (#419)
- Support claims no longer show up on Published page (#384)
- Fixed rendering of small prices (#461)
- Fixed incorrect URI in Downloads/Published page (#460)
- Fixed menu bug (#503)
- Fixed incorrect URLs on some channel content (#505)
- Fixed video sizing for squat videos (#492)
- Fixed issues with small prices (#461)
- Fixed issues with negative values not being stopped by app on entry (#441)
- Fixed source file error when editing existing claim (#467)

## [0.14.3] - 2017-08-03

### Added

- Add tooltips to controls in header
- New flow for rewards authentication failure

### Changed

- Make it clearer how to skip identity verification and add link to FAQ
- Reward-eligible content icon is now a rocket ship :D :D :D
- Change install description shown by operating systems
- Improved flow for when app is run with incompatible daemon

### Fixed

- Corrected improper pluralization on loading screen

## [0.14.2] - 2017-07-30

### Added

- Replaced horizontal scrollbars with scroll arrows
- Featured weekly reward content shows with an orange star

### Fixed

- Fixed requirement to double click play button on many videos
- Fixed errors from calls to `get` not bubbling correctly
- Fixed some corner-case flows that could break file pages

## [0.14.1] - 2017-07-28

### Fixed

- Fixed upgrade file path missing file name

## [0.14.0] - 2017-07-28

### Added

- Identity verification for new reward participants
- Support rich markup in publishing descriptions and show pages.
- Release past publishing claims (and recover LBC) via the UI
- Added transition to card hovers to smooth animation
- Use randomly colored tiles when image is missing from metadata
- Added a loading message to file actions
- URL is auto suggested in Publish Page

### Changed

- Publishing revamped. Editing claims is much easier.
- Daemon updated from v0.13.1 to [v0.14.2](https://github.com/lbryio/lbry/releases/tag/v0.14.2)
- Publish page now use `claim_list` rather than `file_list`

### Removed

- Removed bandwidth caps from settings, because the daemon was not respecting them anyway.

### Fixed

- Fixed bug with download notice when switching window focus
- Fixed newly published files appearing twice
- Fixed unconfirmed published files missing channel name
- Fixed old files from updated published claims appearing in downloaded list
- Fixed inappropriate text showing on searches
- Stop discover page from pushing jumping vertically while loading
- Restored feedback on claim amounts
- Fixed hiding price input when Free is checked on publish form
- Fixed hiding new identity fields on publish form
- Fixed files on downloaded tab not showing download progress
- Fixed downloading files that are deleted not being removed from the downloading list
- Fixed download progress bar not being cleared when a downloading file is deleted
- Fixed refresh regression after adding scroll position to history state
- Fixed app not monitoring download progress on files in progress between restarts

## [0.13.0] - 2017-06-30

### Added

- State is persisted through app close and re-open, resulting in faster opens
- Desktop notifications on downloads finishing
- Support webm, ogg, m4v, and a few others
- Translations added to build process
- Claim IDs are shown in your published files

### Changed

- Upgraded to lbry daemon 0.13, including updating API signatures
- Channels resolve much faster
- Resolve is no longer cancelled on navigate
- Updated API and authentication used by rewards process
- Improved security of reward credential storage
- Additional information submitted in DMCA reports
- Switched packaging to yarn

### Removed

- The author metadata field is no longer shown, in favor of first-class identities
- Availability is no longer checked before showing Download options, due to unreliability

### Fixed

- Fix help menu force reloading whole app
- Show page updates correctly when navigating from show page to another show page
- NSFW setting respected on show page
- URI handling navigates to correct page if app is closed
- URI handling issues specific to Windows (maybe)
- Changing the NSFW setting refreshes properly (previously required app restart)

## [0.12.0] - 2017-06-09

### Added

- More file types, like audio and documents, can be streamed and/or served from the app
- App is no longer gated. Reward authorization re-written. Added basic flows for new users.
- Videos now have a classy loading spinner

### Changed

- All UI strings are now rendered according to gettext standard, in prep for i18n
- Switched to new fee metadata format

### Fixed

- If a daemon is running but unresponsive, startup is no longer blocked indefinitely
- Updated deprecated LBRY API call signatures
- App scrolls to the top of the page on navigation
- Download progress works properly for purchased but deleted files
- Publish channels for less than 1 LBC

## [0.11.9] - 2017-06-01

### Fixed

- Windows upgrade process fixed
- Upgrade process on Mac and Linux will open the file rather than the folder

## [0.11.8] - 2017-05-31

### Fixed

- Verified access from two different installation ids
- Version upgrade check on help page

## [0.11.7] - 2017-05-30

### Changed

- Video player switched from plyr to render-media

### Fixed

- Video player should behave better on streaming
- Daemon times out more quickly when it cannot start
- Connection should fail more cleanly, rather than get stuck entirely
- Closing modal dialogs was broken on some download and stream errors
- Discover landing page improperly showed loading error when it was loading correctly

## [0.11.6] - 2017-05-29

### Changed

- Do not use a separate claim cache for publishes

### Fixed

- Upgrade process should now works on Windows
- Crudely handle failed publishes missing outpoints

## [0.11.5] - 2017-05-28

### Fixed

- Eliminated instance of costs being double fetched
- Fixed issue preventing file re-download
- Fixed race condition that could prevent file playback
- Fixed issue with batch actions and thunk

## [0.11.4] - 2017-05-26

### Added

- New reward for watching weekly featured content

### Fixed

- Video playback will always properly fetch cost info (this was a big playback bug)
- Fixed view rewards

## [0.11.3] - 2017-05-26

### Fixed

- Fixed always showing welcome message on run
- "Fixed" upgrade process
- Version info now shows properly on Help page
- Claim info is properly accessed on Publish page

## [0.11.0] - 2017-05-25

### Added

- Entire app re-written to use Redux as state store. Far saner and faster. Will also increase productivity moving forward.
- Channel page shows content published in channel.
- URI handling. Clicking lbry:// links should open the app and appropriate URI on all Operating Systems.
- File cards have an icon indicating you posses that file.
- Download directory setting now uses a proper dialog.
- Movie player automatically shows if the file has already been downloaded.

### Changed

- Plyr replaces mediaelement as the movie player.

### Fixed

- Publisher indicator on show pages and file cards/tiles will now always show the proper channel name.
- Performance improvements related to avoiding duplicate fetches.
- Fix incorrect prompt on empty published page

## [0.10.0] - 2017-05-04

### Added

- The UI has been overhauled to use an omnibar and drop the sidebar.
- The app is much more responsive switching pages. It no longer reloads the entire page and all assets on each page change.
- lbry.js now offers a subscription model for wallet balance similar to file info.
- Fixed file info subscribes not being unsubscribed in unmount.
- Fixed drawer not highlighting selected page.
- You can now make API calls directly on the lbry module, e.g. lbry.peer_list()
- New-style API calls return promises instead of using callbacks.
- Wherever possible, use outpoints for unique IDs instead of names or SD hashes.
- New publishes now display immediately in My Files, even before they hit the lbrynet file manager.
- New welcome flow for new users.
- Redesigned UI for Discover.
- Handle more of price calculations at the daemon layer to improve page load time.
- Add special support for building channel claims in lbryuri module.
- Enable windows code signing of binary.
- Support for opening LBRY URIs from links in other apps.

### Changed

- Update process now easier and more reliable.
- Updated search to be compatible with new Lighthouse servers.
- Cleaned up shutdown logic.
- Support lbry v0.10 API signatures.

### Fixed

- Fix Watch page and progress bars for new API changes.
- On Windows, prevent opening multiple LBRY instances (launching LBRY again just focuses the current instance).

## [0.9.0rc15] - 2017-03-09

### Added

- A way to access the Developer Settings panel in Electron (Ctrl-Shift and click logo).
- Option in Developer Settings to toggle developer menu.

### Changed

- Open and reveal files using Electron instead of daemon.

## [0.9.0rc12] - 2017-03-06

### Changed

- Improved ability to style FormFields and form field labels.
- Refactored Publish page to use form field changes.

## [0.9.0rc11] - 2017-02-27

### Added

- "Back to LBRY" button on Watch page.

### Changed

- In error modal, hide details in expandable section.

### Fixed

- On load screen, always show Cancel link if a previous page is available.
- When user hits "Watch," don't check balance if download already started.
- Restore UI version on Help page.
- Fix sorting on My Files page.

## [0.9.0rc9] - 2017-02-22

### Changed

- Use local file for publishing
- Use local file and html5 for video playback
- Misc changes needed to make UI compatible with electron.
