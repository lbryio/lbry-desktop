import { createSelector } from 'reselect';
import { parseQueryParams } from 'util/query_params';

export const selectState = state => state.navigation || {};

export const selectCurrentPath = createSelector(selectState, state => state.currentPath);

export const computePageFromPath = path => path.replace(/^\//, '').split('?')[0];

export const selectCurrentPage = createSelector(selectCurrentPath, path =>
  computePageFromPath(path)
);

export const selectCurrentParams = createSelector(selectCurrentPath, path => {
  if (path === undefined) return {};
  if (!path.match(/\?/)) return {};

  return parseQueryParams(path.split('?')[1]);
});

export const makeSelectCurrentParam = param =>
  createSelector(selectCurrentParams, params => (params ? params[param] : undefined));

export const selectPathAfterAuth = createSelector(selectState, state => state.pathAfterAuth);

export const selectIsBackDisabled = createSelector(selectState, state => state.index === 0);

export const selectIsForwardDisabled = createSelector(
  selectState,
  state => state.index === state.stack.length - 1
);

export const selectIsHome = createSelector(selectCurrentPage, page => page === 'discover');

export const selectHistoryIndex = createSelector(selectState, state => state.index);

export const selectHistoryStack = createSelector(selectState, state => state.stack);

// returns current page attributes (scrollY, path)
export const selectActiveHistoryEntry = createSelector(
  selectState,
  state => state.stack[state.index]
);

export const selectPageTitle = createSelector(selectCurrentPage, page => {
  switch (page) {
    default:
      return '';
  }
});

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
      page === 'invite';

    const isMyLbryPage = page =>
      page === 'downloaded' || page === 'published' || page === 'settings';

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
        label: 'Send & Recieve',
        path: '/send',
        active: currentPage === 'send',
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
        label: 'Transactions',
        path: '/history',
        active: currentPage === 'history',
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
        label: 'Settings',
        path: '/settings',
        active: currentPage === 'settings',
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
          icon: 'Settings',
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
          label: 'Help',
          path: '/help',
          active: currentPage === 'help',
          icon: 'HelpCircle',
        },
      ],
    };

    return navLinks;
  }
);
