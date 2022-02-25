import { createSelector } from 'reselect';
import { selectClaimsById, selectMyChannelClaims, selectTotalStakedAmountForChannelUri } from 'redux/selectors/claims';
import { AUTO_UPDATE_DOWNLOADED } from 'constants/modal_types';

export const selectState = (state) => state.app || {};

export const selectPlatform = createSelector(selectState, (state) => state.platform);

export const selectUpdateUrl = createSelector(selectPlatform, (platform) => {
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
});

export const selectHasClickedComment = createSelector(selectState, (state) => state.hasClickedComment);

export const selectRemoteVersion = createSelector(selectState, (state) => state.remoteVersion);

export const selectIsUpgradeAvailable = createSelector(selectState, (state) => state.isUpgradeAvailable);

export const selectUpgradeFilename = createSelector(selectPlatform, selectRemoteVersion, (platform, version) => {
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
});

export const selectDownloadProgress = createSelector(selectState, (state) => state.downloadProgress);

export const selectDownloadComplete = createSelector(selectState, (state) => state.upgradeDownloadCompleted);

export const selectIsUpgradeSkipped = createSelector(selectState, (state) => state.isUpgradeSkipped);

export const selectUpgradeDownloadPath = createSelector(selectState, (state) => state.downloadPath);

export const selectUpgradeDownloadItem = createSelector(selectState, (state) => state.downloadItem);

export const selectAutoUpdateDownloaded = createSelector(selectState, (state) => state.autoUpdateDownloaded);

export const selectAutoUpdateDeclined = createSelector(selectState, (state) => state.autoUpdateDeclined);

export const selectIsUpdateModalDisplayed = createSelector(selectState, (state) => {
  return state.modal === AUTO_UPDATE_DOWNLOADED;
});

export const selectDaemonVersionMatched = createSelector(selectState, (state) => state.daemonVersionMatched);

export const selectVolume = createSelector(selectState, (state) => state.volume);

export const selectMute = createSelector(selectState, (state) => state.muted);

export const selectUpgradeTimer = createSelector(selectState, (state) => state.checkUpgradeTimer);

export const selectModal = createSelector(selectState, (state) => {
  if (!state.modal) {
    return null;
  }

  return {
    id: state.modal,
    modalProps: state.modalProps,
  };
});

export const selectSearchOptionsExpanded = createSelector(selectState, (state) => state.searchOptionsExpanded);

export const selectWelcomeVersion = createSelector(selectState, (state) => state.welcomeVersion);

export const selectHasNavigated = createSelector(selectState, (state) => state.hasNavigated);

export const selectAllowAnalytics = createSelector(selectState, (state) => state.allowAnalytics);

export const selectScrollStartingPosition = createSelector(selectState, (state) => state.currentScroll);

export const selectIsPasswordSaved = createSelector(selectState, (state) => state.isPasswordSaved);

export const selectInterestedInYoutubeSync = createSelector(selectState, (state) => state.interestedInYoutubeSync);

export const selectSplashAnimationEnabled = createSelector(selectState, (state) => state.splashAnimationEnabled);

export const selectActiveChannelId = createSelector(selectState, (state) => state.activeChannel);

export const selectActiveChannelClaim = createSelector(
  selectActiveChannelId,
  selectClaimsById,
  selectMyChannelClaims,
  (activeChannelClaimId, claimsById, myChannelClaims) => {
    if (!activeChannelClaimId || !claimsById || !myChannelClaims || !myChannelClaims.length) {
      return undefined;
    }

    const activeChannelClaim = claimsById[activeChannelClaimId];
    if (activeChannelClaim) {
      return activeChannelClaim;
    }

    const myChannelClaimsByEffectiveAmount = myChannelClaims.slice().sort((a, b) => {
      const effectiveAmountA = (a.meta && Number(a.meta.effective_amount)) || 0;
      const effectiveAmountB = (b.meta && Number(b.meta.effective_amount)) || 0;
      if (effectiveAmountA === effectiveAmountB) {
        return 0;
      } else if (effectiveAmountA > effectiveAmountB) {
        return -1;
      } else {
        return 1;
      }
    });

    return myChannelClaimsByEffectiveAmount[0];
  }
);

export const selectActiveChannelStakedLevel = createSelector(
  (state) => state,
  selectActiveChannelClaim,
  (state, activeChannelClaim) => {
    if (!activeChannelClaim) {
      return 0;
    }

    const uri = activeChannelClaim.permanent_url;
    const stakedLevel = selectTotalStakedAmountForChannelUri(state, uri);

    return stakedLevel;
  }
);

export const selectIncognito = createSelector(selectState, (state) => state.incognito);

export const selectDiskSpace = createSelector(selectState, (state) => state.diskSpace);
