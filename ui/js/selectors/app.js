import { createSelector } from 'reselect'

export const _selectState = state => state.app || {}

export const selectIsLoaded = createSelector(
  _selectState,
  (state) => state.isLoaded
)

export const selectCurrentPath = createSelector(
  _selectState,
  (state) => state.currentPath
)

export const selectCurrentPage = createSelector(
  selectCurrentPath,
  (path) => path.split('=')[0]
)

export const selectCurrentUri = createSelector(
  selectCurrentPath,
  (path) => {
    if (path.match(/=/)) {
      return path.split('=')[1]
    } else {
      return undefined
    }
  }
)

export const selectPlatform = createSelector(
  _selectState,
  (state) => state.platform
)

export const selectUpdateUrl = createSelector(
  selectPlatform,
  (platform) => {
    switch (platform) {
      case 'darwin':
        return 'https://lbry.io/get/lbry.dmg';
      case 'linux':
        return 'https://lbry.io/get/lbry.deb';
      case 'win32':
        return 'https://lbry.io/get/lbry.exe';
      default:
        throw 'Unknown platform';
    }
  }
)

export const selectVersion = createSelector(
  _selectState,
  (state) => {
    return state.version
  }
)

export const selectUpgradeFilename = createSelector(
  selectPlatform,
  selectVersion,
  (platform, version) => {
    switch (platform) {
      case 'darwin':
        return `LBRY-${version}.dmg`;
      case 'linux':
        return `LBRY_${version}_amd64.deb`;
      case 'windows':
        return `LBRY.Setup.${version}.exe`;
      default:
        throw 'Unknown platform';
    }
  }
)

export const selectCurrentModal = createSelector(
  _selectState,
  (state) => state.modal
)

export const selectDownloadProgress = createSelector(
  _selectState,
  (state) => state.downloadProgress
)

export const selectDownloadComplete = createSelector(
  _selectState,
  (state) => state.upgradeDownloadCompleted
)

export const selectDrawerOpen = createSelector(
  _selectState,
  (state) => state.drawerOpen
)

export const selectHeaderLinks = createSelector(
  selectCurrentPage,
  (page) => {
    switch(page)
    {
      case 'wallet':
      case 'send':
      case 'receive':
      case 'claim':
      case 'referral':
        return {
          'wallet' : 'Overview',
          'send' : 'Send',
          'receive' : 'Receive',
          'claim' : 'Claim Beta Code',
          'referral' : 'Check Referral Credit',
        };
      case 'downloaded':
      case 'published':
        return {
          'downloaded': 'Downloaded',
          'published': 'Published',
        };
      default:
        return null;
    }
  }
)

export const selectUpgradeSkipped = createSelector(
  _selectState,
  (state) => state.upgradeSkipped
)

export const selectUpgradeDownloadDir = createSelector(
  _selectState,
  (state) => state.downloadDir
)

export const selectUpgradeDownloadItem = createSelector(
  _selectState,
  (state) => state.downloadItem
)

export const selectSearchTerm = createSelector(
  _selectState,
  (state) => state.searchTerm
)

export const selectError = createSelector(
  _selectState,
  (state) => state.error
)

export const selectDaemonReady = createSelector(
  _selectState,
  (state) => state.daemonReady
)

export const selectObscureNsfw = createSelector(
  _selectState,
  (state) => !!state.obscureNsfw
)

export const selectHidePrice = createSelector(
  _selectState,
  (state) => !!state.hidePrice
)

export const selectHasSignature = createSelector(
  _selectState,
  (state) => !!state.hasSignature
)
