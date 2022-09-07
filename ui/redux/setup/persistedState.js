import localForage from 'localforage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import createCompressor from 'redux-persist-transform-compress';
import { createFilter, createBlacklistFilter } from 'redux-persist-transform-filter';

const FILTERS = {
  claims: createFilter('claims', ['pendingById']),
  fileInfo: createFilter('fileInfo', ['fileListPublishedSort', 'fileListDownloadedSort', 'fileListSubscriptionSort']),
  wallet: createFilter('wallet', ['receiveAddress']), // We only need to persist the receiveAddress for the wallet
  blocked: createFilter('blocked', ['blockedChannels']),
  coinSwaps: createFilter('coinSwap', ['coinSwaps']),
  tags: createFilter('tags', ['followedTags']),
  app: createFilter('app', [
    'hasClickedComment',
    'searchOptionsExpanded',
    'volume',
    'muted',
    'allowAnalytics',
    'welcomeVersion',
    'interestedInYoutubeSync',
    'splashAnimationEnabled',
    'activeChannel',
  ]),
  search: createFilter('search', ['options']),
  content: createFilter('content', ['positions', 'history', 'lastViewedAnnouncement', 'recsysEntries']),
  subscriptions: createFilter('subscriptions', ['subscriptions']),
  settings: createBlacklistFilter('settings', ['loadedLanguages']),
  collections: createFilter('collections', ['builtin', 'savedIds', 'unpublished', 'edited', 'updated', 'pending']),
};

const whiteListedReducers = [
  'claims',
  'fileInfo',
  'publish',
  'wallet',
  'tags',
  'content',
  'app',
  'search',
  'blocked',
  'coinSwap',
  'settings',
  'subscriptions',
  'collections',
];

// Order is important. Needs to be compressed last or other transforms can't read the data.
const transforms = [...Object.values(FILTERS), createCompressor()];

export const persistOptions = {
  key: 'v0',
  storage: localForage,
  stateReconciler: autoMergeLevel2,
  whitelist: whiteListedReducers,
  transforms,
};
