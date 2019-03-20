import * as SETTINGS from 'constants/settings';
import * as PAGES from 'constants/pages';
import * as ICONS from 'constants/icons';
import { createSelector } from 'reselect';
import { selectCurrentPage, selectHistoryStack } from 'lbry-redux';
import { makeSelectClientSetting } from 'redux/selectors/settings';

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

export const selectSnackBar = createSelector(
  selectState,
  state => state.snackBar || {}
);

export const selectSnackBarSnacks = createSelector(
  selectSnackBar,
  snackBar => snackBar.snacks || []
);

export const selectBadgeNumber = createSelector(
  selectState,
  state => state.badgeNumber
);

export const selectCurrentLanguage = createSelector(
  selectState,
  () => i18n.getLocale() || 'en'
);

export const selectVolume = createSelector(
  selectState,
  state => state.volume
);

export const selectUpgradeTimer = createSelector(
  selectState,
  state => state.checkUpgradeTimer
);

export const selectNavLinks = createSelector(
  selectCurrentPage,
  selectHistoryStack,
  makeSelectClientSetting(SETTINGS.FIRST_RUN_COMPLETED),
  makeSelectClientSetting(SETTINGS.INVITE_ACKNOWLEDGED),
  (currentPage, historyStack, firstRunCompleted, inviteAcknowledged) => {
    // Determine if any links should show a tooltip for a guided tour
    // It will only show one at a time, in the order they are set.
    const guidedTourItem = [
      // @if TARGET='app'
      {
        page: PAGES.INVITE,
        hasBeenCompleted: inviteAcknowledged,
        guide: 'Check this out!',
      },
      // @endif
      // Add more items below for tooltip guides that will happen after a user has completed the invite guide
    ].filter(({ hasBeenCompleted }) => !hasBeenCompleted)[0];

    const isWalletPage = page =>
      page === PAGES.WALLET ||
      page === PAGES.SEND ||
      page === PAGES.GET_CREDITS ||
      page === PAGES.HISTORY ||
      page === PAGES.BACKUP;

    const isCurrentlyWalletPage = isWalletPage(currentPage);
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
      if (category === PAGES.WALLET) {
        const previousPath = getPreviousSubLinkPath(isWalletPage);
        return previousPath || `/${PAGES.WALLET}`;
      }

      return undefined;
    };

    // Is this path the first unacknowledged item in the guided tour list
    const getGuideIfNecessary = page => {
      if (!firstRunCompleted) {
        return null;
      }
      return guidedTourItem && guidedTourItem.page === page ? guidedTourItem.guide : null;
    };

    const buildLink = (label, page) => ({
      label,
      path: `/${page}`,
      active: currentPage === page,
      guide: getGuideIfNecessary(page),
    });

    const walletSubLinks = [
      {
        ...buildLink('Overview', PAGES.WALLET),
      },
      {
        ...buildLink('Send & Receive', PAGES.SEND),
      },
      {
        ...buildLink('Transactions', PAGES.HISTORY),
      },
      {
        ...buildLink('Get Credits', PAGES.GET_CREDITS),
      },
      {
        ...buildLink('Backup', PAGES.BACKUP),
      },
    ];

    const navLinks = {
      primary: [
        {
          ...buildLink('Explore', PAGES.DISCOVER),
          icon: ICONS.HOME,
        },
        {
          ...buildLink('Subscriptions', PAGES.SUBSCRIPTIONS),
          icon: ICONS.SUBSCRIPTION,
        },
      ],
      secondary: [
        {
          label: 'Wallet',
          icon: ICONS.WALLET,
          subLinks: walletSubLinks,
          path: isCurrentlyWalletPage ? `/${PAGES.WALLET}` : getActiveSublink(PAGES.WALLET),
          active: isWalletPage(currentPage),
        },
        {
          ...buildLink('Invite', PAGES.INVITE),
          icon: ICONS.INVITE,
        },
        {
          ...buildLink('Rewards', PAGES.REWARDS),
          // This probably shouldn't use the "FEATURED" icon, but not sure what else to use
          icon: ICONS.FEATURED,
        },
        {
          ...buildLink('Downloads', PAGES.DOWNLOADED),
          icon: ICONS.LOCAL,
        },
        {
          ...buildLink('Publishes', PAGES.PUBLISHED),
          icon: ICONS.PUBLISHED,
        },
        {
          ...buildLink('History', PAGES.USER_HISTORY),
          icon: ICONS.HISTORY,
        },
        {
          ...buildLink('Settings', PAGES.SETTINGS),
          icon: ICONS.SETTINGS,
        },
        {
          ...buildLink('Help', PAGES.HELP),
          icon: ICONS.HELP,
        },
      ],
    };

    return navLinks;
  }
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

export const selectEnhancedLayout = createSelector(
  selectState,
  state => state.enhancedLayout
);

export const selectSearchOptionsExpanded = createSelector(
  selectState,
  state => state.searchOptionsExpanded
);
