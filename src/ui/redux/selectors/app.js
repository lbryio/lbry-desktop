import { createSelector } from 'reselect';

export const selectState = state => state.app || {};

export const selectPlatform = createSelector(
  selectState,
  state => state.platform
);

export const selectUpdateUrl = createSelector(
  selectPlatform,
  platform => {
    switch (platform) {
      case 'darwin':
        return 'https://lbry.com/get/lbry.dmg';
      case 'linux':
        return 'https://lbry.com/get/lbry.deb';
      case 'win32':
        return 'https://lbry.com/get/lbry.exe';
      default:
        throw Error('Unknown platform');
    }
  }
);

export const selectHasClickedComment = createSelector(
  selectState,
  state => state.hasClickedComment
);

export const selectRemoteVersion = createSelector(
  selectState,
  state => state.remoteVersion
);

export const selectIsUpgradeAvailable = createSelector(
  selectState,
  state => state.isUpgradeAvailable
);

export const selectUpgradeFilename = createSelector(
  selectPlatform,
  selectRemoteVersion,
  (platform, version) => {
    switch (platform) {
      case 'darwin':
        return `LBRY_${version}.dmg`;
      case 'linux':
        return `LBRY_${version}.deb`;
      case 'win32':
        return `LBRY_${version}.exe`;
      default:
        throw Error('Unknown platform');
    }
  }
);

export const selectDownloadProgress = createSelector(
  selectState,
  state => state.downloadProgress
);

export const selectDownloadComplete = createSelector(
  selectState,
  state => state.upgradeDownloadCompleted
);

export const selectIsUpgradeSkipped = createSelector(
  selectState,
  state => state.isUpgradeSkipped
);

export const selectUpgradeDownloadPath = createSelector(
  selectState,
  state => state.downloadPath
);

export const selectUpgradeDownloadItem = createSelector(
  selectState,
  state => state.downloadItem
);

export const selectAutoUpdateDownloaded = createSelector(
  selectState,
  state => state.autoUpdateDownloaded
);

export const selectAutoUpdateDeclined = createSelector(
  selectState,
  state => state.autoUpdateDeclined
);

export const selectDaemonVersionMatched = createSelector(
  selectState,
  state => state.daemonVersionMatched
);

export const selectVolume = createSelector(
  selectState,
  state => state.volume
);

export const selectMute = createSelector(
  selectState,
  state => state.muted
);

export const selectUpgradeTimer = createSelector(
  selectState,
  state => state.checkUpgradeTimer
);

export const selectModal = createSelector(
  selectState,
  state => {
    if (!state.modal) {
      return null;
    }

    return {
      id: state.modal,
      modalProps: state.modalProps,
    };
  }
);

export const selectSearchOptionsExpanded = createSelector(
  selectState,
  state => state.searchOptionsExpanded
);

export const selectScrollStartingPosition = createSelector(
  selectState,
  state => state.currentScroll
);
