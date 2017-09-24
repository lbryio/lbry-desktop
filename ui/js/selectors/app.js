import { createSelector } from "reselect";

export const _selectState = state => state.app || {};

export const selectPlatform = createSelector(
  _selectState,
  state => state.platform
);

export const selectUpdateUrl = createSelector(selectPlatform, platform => {
  switch (platform) {
    case "darwin":
      return "https://lbry.io/get/lbry.dmg";
    case "linux":
      return "https://lbry.io/get/lbry.deb";
    case "win32":
      return "https://lbry.io/get/lbry.exe";
    default:
      throw "Unknown platform";
  }
});

export const selectVersion = createSelector(_selectState, state => {
  return state.version;
});

export const selectUpgradeFilename = createSelector(
  selectPlatform,
  selectVersion,
  (platform, version) => {
    switch (platform) {
      case "darwin":
        return `LBRY_${version}.dmg`;
      case "linux":
        return `LBRY_${version}_amd64.deb`;
      case "win32":
        return `LBRY_${version}.exe`;
      default:
        throw "Unknown platform";
    }
  }
);

export const selectCurrentModal = createSelector(
  _selectState,
  state => state.modal
);

export const selectDownloadProgress = createSelector(
  _selectState,
  state => state.downloadProgress
);

export const selectDownloadComplete = createSelector(
  _selectState,
  state => state.upgradeDownloadCompleted
);

export const selectUpgradeSkipped = createSelector(
  _selectState,
  state => state.upgradeSkipped
);

export const selectUpgradeDownloadPath = createSelector(
  _selectState,
  state => state.downloadPath
);

export const selectUpgradeDownloadItem = createSelector(
  _selectState,
  state => state.downloadItem
);

export const selectModalProps = createSelector(
  _selectState,
  state => state.modalProps
);

export const selectDaemonReady = createSelector(
  _selectState,
  state => state.daemonReady
);

export const selectDaemonVersionMatched = createSelector(
  _selectState,
  state => state.daemonVersionMatched
);

export const selectSnackBar = createSelector(
  _selectState,
  state => state.snackBar || {}
);

export const selectSnackBarSnacks = createSelector(
  selectSnackBar,
  snackBar => snackBar.snacks || []
);

export const selectBadgeNumber = createSelector(
  _selectState,
  state => state.badgeNumber
);

export const selectCurrentLanguage = createSelector(
  _selectState,
  () => app.i18n.getLocale() || "en"
);

export const selectKeepPlaying = createSelector(
  _selectState,
  state => state.keepPlaying
);

export const selectMediaUri = createSelector(
  _selectState,
  state => state.mediaUri
);

export const selectVolume = createSelector(_selectState, state => state.volume);
