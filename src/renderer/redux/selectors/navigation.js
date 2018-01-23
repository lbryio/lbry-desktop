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

export const selectPageTitle = createSelector(
  selectCurrentPage,
  (page) => {
    switch (page) {
      default:
        return '';
    }
  }
);

export const selectNavLinks = createSelector(
  selectCurrentPage,
  selectHistoryStack,
  (currentPage, historyStack) => {
    const isWalletPage = page =>
      page === 'wallet' ||
      page === 'send' ||
      page === 'getcredits' ||
      page === 'rewards' ||
      page === 'history';

    let walletLink;
    if (isWalletPage(currentPage)) {
      // If they are on a wallet page, the top level link should direct them to the overview page
      walletLink = '/wallet';
    } else {
      // check to see if they've recently been on a wallet sub-link
      const previousStack = historyStack.slice().reverse();
      for (let i = 0; i < previousStack.length; i += 1) {
        const currentStackItem = previousStack[i];

        // Trim off the "/" from the path
        const pageInStack = currentStackItem.path.slice(1);
        if (isWalletPage(pageInStack)) {
          walletLink = currentStackItem.path;
          break;
        }
      }
    }

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
        label: 'My Transactions',
        path: '/history',
        active: currentPage === 'history',
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
          path: walletLink || '/wallet', // If they've never been to a wallet page, take them to the overview
          active:
            currentPage === 'wallet' ||
            !!walletSubLinks.find(({ path }) => currentPage === path.slice(1)),
          subLinks: walletSubLinks,
          icon: 'CreditCard',
        },
        {
          label: 'Publish',
          path: '/publish',
          active: currentPage === 'publish',
          icon: 'UploadCloud',
        },
        {
          label: 'Settings',
          path: '/settings',
          active: currentPage === 'settings',
          icon: 'Settings',
        },
        {
          label: 'Backup Wallet',
          path: '/backup',
          active: currentPage === 'backup',
          icon: 'Save',
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
