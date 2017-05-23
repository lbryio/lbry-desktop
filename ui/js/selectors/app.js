import {createSelector} from 'reselect'
import {
  parseQueryParams,
} from 'util/query_params'
import lbryuri from 'lbryuri'

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
  (path) => {
    return path.replace(/^\//, '').split('?')[0]
  }
)

export const selectCurrentParams = createSelector(
  selectCurrentPath,
  (path) => {
    if (path === undefined) return {}
    if (!path.match(/\?/)) return {}

    return parseQueryParams(path.split('?')[1])
  }
)

export const selectPageTitle = createSelector(
  selectCurrentPage,
  selectCurrentParams,
  (page, params) => {
    switch (page) {
      case 'search':
        return params.query ? `Search results for ${params.query}` : 'Search'
      case 'settings':
        return 'Settings'
      case 'help':
        return 'Help'
      case 'report':
        return 'Report'
      case 'wallet':
      case 'send':
      case 'receive':
      case 'rewards':
        return page.charAt(0).toUpperCase() + page.slice(1)
      case 'show':
        return lbryuri.normalize(params.uri)
      case 'downloaded':
        return 'Downloads & Purchases'
      case 'published':
        return 'Publishes'
      case 'start':
        return 'Start'
      case 'publish':
        return 'Publish'
      case 'help':
        return 'Help'
      case 'developer':
        return 'Developer'
      case 'discover':
        return 'Home'
      default:
        return '';
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

export const selectHeaderLinks = createSelector(
  selectCurrentPage,
  (page) => {
    switch (page) {
      case 'wallet':
      case 'send':
      case 'receive':
      case 'rewards':
        return {
          'wallet': 'Overview',
          'send': 'Send',
          'receive': 'Receive',
          'rewards': 'Rewards',
        };
      case 'downloaded':
      case 'published':
        return {
          'downloaded': 'Downloaded',
          'published': 'Published',
        };
      case 'settings':
      case 'help':
        return {
          'settings': 'Settings',
          'help': 'Help',
        }
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

export const selectSnackBar = createSelector(
  _selectState,
  (state) => state.snackBar || {}
)

export const selectSnackBarSnacks = createSelector(
  selectSnackBar,
  (snackBar) => snackBar.snacks || []
)