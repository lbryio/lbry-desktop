import { createSelector } from 'reselect';
import { selectCurrentPage, selectHistoryStack } from 'lbry-redux';

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
      page === 'invite' ||
      page === 'backup';

    const isMyLbryPage = page =>
      page === 'downloaded' || page === 'published' || page === 'user_history';

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
      } else if (category === 'myLbry') {
        const previousPath = getPreviousSubLinkPath(isMyLbryPage);
        return previousPath || '/downloaded';
      }

      return undefined;
    };

    const isCurrentlyWalletPage = isWalletPage(currentPage);
    const isCurrentlyMyLbryPage = isMyLbryPage(currentPage);

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
        label: 'Invites',
        path: '/invite',
        active: currentPage === 'invite',
      },
      {
        label: 'Backup',
        path: '/backup',
        active: currentPage === 'backup',
      },
    ];

    const myLbrySubLinks = [
      {
        label: 'Downloads',
        path: '/downloaded',
        active: currentPage === 'downloaded',
      },
      {
        label: 'Publishes',
        path: '/published',
        active: currentPage === 'published',
      },
      {
        label: 'History',
        path: '/user_history',
        active: currentPage === 'user_history',
      },
    ];

    const navLinks = {
      primary: [
        {
          label: 'Explore',
          path: '/discover',
          active: currentPage === 'discover',
          icon: 'Compass',
        },
        {
          label: 'Subscriptions',
          path: '/subscriptions',
          active: currentPage === 'subscriptions',
          icon: 'AtSign',
        },
      ],
      secondary: [
        {
          label: 'Wallet',
          icon: 'CreditCard',
          subLinks: walletSubLinks,
          path: isCurrentlyWalletPage ? '/wallet' : getActiveSublink('wallet'),
          active: isWalletPage(currentPage),
        },
        {
          label: 'My LBRY',
          icon: 'Folder',
          subLinks: myLbrySubLinks,
          path: isCurrentlyMyLbryPage ? '/downloaded' : getActiveSublink('myLbry'),
          active: isMyLbryPage(currentPage),
        },
        {
          label: 'Publish',
          icon: 'UploadCloud',
          path: '/publish',
          active: currentPage === 'publish',
        },
        {
          label: 'Settings',
          icon: 'Settings',
          path: '/settings',
          active: currentPage === 'settings',
        },
        {
          label: 'Help',
          path: '/help',
          icon: 'HelpCircle',
          active: currentPage === 'help',
        },
      ],
    };

    return navLinks;
  }
);
