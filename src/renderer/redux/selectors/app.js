import { createSelector } from 'reselect';
import { selectCurrentPage, selectHistoryStack } from 'lbry-redux';
import * as icons from 'constants/icons';

export const selectState = state => state.app || {};

export const selectPlatform = createSelector(selectState, state => state.platform);

export const selectUpdateUrl = createSelector(selectPlatform, platform => {
  switch (platform) {
    case 'darwin':
      return 'https://lbry.io/get/lbry.dmg';
    case 'linux':
      return 'https://lbry.io/get/lbry.deb';
    case 'win32':
      return 'https://lbry.io/get/lbry.exe';
    default:
      throw Error('Unknown platform');
  }
});

export const selectHasClickedComment = createSelector(
  selectState,
  state => state.hasClickedComment
);

export const selectRemoteVersion = createSelector(selectState, state => state.remoteVersion);

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

export const selectDownloadProgress = createSelector(selectState, state => state.downloadProgress);

export const selectDownloadComplete = createSelector(
  selectState,
  state => state.upgradeDownloadCompleted
);

export const selectIsUpgradeSkipped = createSelector(selectState, state => state.isUpgradeSkipped);

export const selectUpgradeDownloadPath = createSelector(selectState, state => state.downloadPath);

export const selectUpgradeDownloadItem = createSelector(selectState, state => state.downloadItem);

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

export const selectSnackBar = createSelector(selectState, state => state.snackBar || {});

export const selectSnackBarSnacks = createSelector(
  selectSnackBar,
  snackBar => snackBar.snacks || []
);

export const selectBadgeNumber = createSelector(selectState, state => state.badgeNumber);

export const selectCurrentLanguage = createSelector(
  selectState,
  () => app.i18n.getLocale() || 'en'
);

export const selectVolume = createSelector(selectState, state => state.volume);

export const selectUpgradeTimer = createSelector(selectState, state => state.checkUpgradeTimer);

export const selectNavLinks = createSelector(
  selectCurrentPage,
  selectHistoryStack,
  (currentPage, historyStack) => {
    const isWalletPage = page =>
      page === 'wallet' ||
      page === 'send' ||
      page === 'getcredits' ||
      page === 'rewards' ||
      page === 'history' ||
      page === 'backup';

    const previousStack = historyStack.slice().reverse();

    const getPreviousSubLinkPath = checkIfValidPage => {
      for (let i = 0; i < previousStack.length; i += 1) {
        const currentStackItem = previousStack[i];

        // Trim off the "/" from the path
        const pageInStack = currentStackItem.path.slice(1);
        if (checkIfValidPage(pageInStack)) {
          return currentStackItem.path;
        }
      }

      return undefined;
    };

    // Gets the last active sublink in a section
    const getActiveSublink = category => {
      if (category === 'wallet') {
        const previousPath = getPreviousSubLinkPath(isWalletPage);
        return previousPath || '/wallet';
      }

      return undefined;
    };

    const isCurrentlyWalletPage = isWalletPage(currentPage);

    const walletSubLinks = [
      {
        label: 'Overview',
        path: '/wallet',
        active: currentPage === 'wallet',
      },
      {
        label: 'Send & Receive',
        path: '/send',
        active: currentPage === 'send',
      },
      {
        label: 'Transactions',
        path: '/history',
        active: currentPage === 'history',
      },
      {
        label: 'Get Credits',
        path: '/getcredits',
        active: currentPage === 'getcredits',
      },
      {
        label: 'Rewards',
        path: '/rewards',
        active: currentPage === 'rewards',
      },
      {
        label: 'Backup',
        path: '/backup',
        active: currentPage === 'backup',
      },
    ];

    const navLinks = {
      primary: [
        {
          label: 'Explore',
          path: '/discover',
          active: currentPage === 'discover',
          icon: icons.HOME,
        },
        {
          label: 'Subscriptions',
          path: '/subscriptions',
          active: currentPage === 'subscriptions',
          icon: icons.SUBSCRIPTION,
        },
      ],
      secondary: [
        {
          label: 'Wallet',
          icon: icons.WALLET,
          subLinks: walletSubLinks,
          path: isCurrentlyWalletPage ? '/wallet' : getActiveSublink('wallet'),
          active: isWalletPage(currentPage),
        },
        {
          label: 'Invite',
          icon: icons.INVITE,
          path: '/invite',
          active: currentPage === 'invite',
        },
        {
          label: 'Downloads',
          icon: icons.LOCAL,
          path: '/downloaded',
          active: currentPage === 'downloaded',
        },
        {
          label: 'Publishes',
          icon: icons.PUBLISHED,
          path: '/published',
          active: currentPage === 'published',
        },
        {
          label: 'History',
          icon: icons.HISTORY,
          path: '/user_history',
          active: currentPage === 'user_history',
        },
        {
          label: 'Settings',
          icon: icons.SETTINGS,
          path: '/settings',
          active: currentPage === 'settings',
        },
        {
          label: 'Help',
          path: '/help',
          icon: icons.HELP,
          active: currentPage === 'help',
        },
      ],
    };

    return navLinks;
  }
);

export const selectModal = createSelector(selectState, state => {
  if (!state.modal) {
    return null;
  }

  return {
    id: state.modal,
    modalProps: state.modalProps,
  };
});

export const selectEnhancedLayout = createSelector(selectState, state => state.enhancedLayout);
