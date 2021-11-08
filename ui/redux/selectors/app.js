import { createSelector } from 'reselect';
import { selectClaimsById, selectMyChannelClaims, makeSelectStakedLevelForChannelUri } from 'redux/selectors/claims';

export const selectState = (state) => state.app || {};

export const selectPlatform = (state) => selectState(state).platform;

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

export const selectHasClickedComment = (state) => selectState(state).hasClickedComment;
export const selectRemoteVersion = (state) => selectState(state).remoteVersion;
export const selectIsUpgradeAvailable = (state) => selectState(state).isUpgradeAvailable;
export const selectIsReloadRequired = (state) => selectState(state).isReloadRequired;

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

export const selectDownloadProgress = (state) => selectState(state).downloadProgress;
export const selectDownloadComplete = (state) => selectState(state).upgradeDownloadCompleted;
export const selectIsUpgradeSkipped = (state) => selectState(state).isUpgradeSkipped;
export const selectUpgradeDownloadPath = (state) => selectState(state).downloadPath;
export const selectUpgradeDownloadItem = (state) => selectState(state).downloadItem;
export const selectAutoUpdateDownloaded = (state) => selectState(state).autoUpdateDownloaded;
export const selectAutoUpdateDeclined = (state) => selectState(state).autoUpdateDeclined;
export const selectDaemonVersionMatched = (state) => selectState(state).daemonVersionMatched;
export const selectVolume = (state) => selectState(state).volume;
export const selectMute = (state) => selectState(state).muted;
export const selectUpgradeTimer = (state) => selectState(state).checkUpgradeTimer;

export const selectModal = createSelector(selectState, (state) => {
  if (!state.modal) {
    return null;
  }

  return {
    id: state.modal,
    modalProps: state.modalProps,
  };
});

export const selectSearchOptionsExpanded = (state) => selectState(state).searchOptionsExpanded;
export const selectWelcomeVersion = (state) => selectState(state).welcomeVersion;
export const selectHasNavigated = (state) => selectState(state).hasNavigated;
export const selectAllowAnalytics = (state) => selectState(state).allowAnalytics;
export const selectScrollStartingPosition = (state) => selectState(state).currentScroll;
export const selectIsPasswordSaved = (state) => selectState(state).isPasswordSaved;
export const selectInterestedInYoutubeSync = (state) => selectState(state).interestedInYoutubeSync;
export const selectSplashAnimationEnabled = (state) => selectState(state).splashAnimationEnabled;
export const selectActiveChannelId = (state) => selectState(state).activeChannel;

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
    const stakedLevel = makeSelectStakedLevelForChannelUri(uri)(state);
    return stakedLevel;
  }
);

export const selectIncognito = (state) => selectState(state).incognito;
