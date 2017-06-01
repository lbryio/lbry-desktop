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
      case 'settings':
      case 'help':
      case 'report':
      case 'wallet':
      case 'send':
      case 'receive':
      case 'rewards':
      case 'start':
      case 'publish':
      case 'help':
      case 'developer':
        return __(page.charAt(0).toUpperCase() + page.slice(1))
      case 'search':
        return params.query ? __("Search results for %s", params.query) : __('Search')
      case 'show':
        return lbryuri.normalize(params.uri)
      case 'downloaded':
        return __('Downloads & Purchases')
      case 'published':
        return __('Publishes')
      case 'discover':
        return __('Home')
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
        return `LBRY_${version}.dmg`;
      case 'linux':
        return `LBRY_${version}_amd64.deb`;
      case 'win32':
        return `LBRY_${version}.exe`;
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
          'wallet': __('Overview'),
          'send': __('Send'),
          'receive': __('Receive'),
          'rewards': __('Rewards'),
        };
      case 'downloaded':
      case 'published':
        return {
          'downloaded': __('Downloaded'),
          'published': __('Published'),
        };
      case 'settings':
      case 'help':
        return {
          'settings': __('Settings'),
          'help': __('Help'),
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

export const selectUpgradeDownloadPath = createSelector(
  _selectState,
  (state) => state.downloadPath
)

export const selectUpgradeDownloadItem = createSelector(
  _selectState,
  (state) => state.downloadItem
)

export const selectModalExtraContent = createSelector(
  _selectState,
  (state) => state.modalExtraContent
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
