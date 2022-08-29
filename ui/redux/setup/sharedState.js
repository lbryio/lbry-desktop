/**
 * All things shared-state (a.k.a. wallet-sync).
 */

import * as ACTIONS from 'constants/action_types';
import { doSyncLoop } from 'redux/actions/sync';
import { buildSharedStateMiddleware } from 'redux/middleware/shared-state';

export const triggerSharedStateActions = [
  ACTIONS.CHANNEL_SUBSCRIBE,
  ACTIONS.CHANNEL_UNSUBSCRIBE,
  ACTIONS.TOGGLE_BLOCK_CHANNEL,
  ACTIONS.ADD_COIN_SWAP,
  ACTIONS.REMOVE_COIN_SWAP,
  ACTIONS.TOGGLE_TAG_FOLLOW,
  ACTIONS.CREATE_CHANNEL_COMPLETED,
  ACTIONS.SYNC_CLIENT_SETTINGS,
  ACTIONS.SHARED_PREFERENCE_SET,
  ACTIONS.COLLECTION_EDIT,
  ACTIONS.COLLECTION_DELETE,
  ACTIONS.COLLECTION_NEW,
  ACTIONS.COLLECTION_PENDING,
  ACTIONS.COLLECTION_TOGGLE_SAVE,
  ACTIONS.SET_LAST_VIEWED_ANNOUNCEMENT,
];

/**
 * source: the reducer name
 * property: the property in the reducer-specific state
 * transform: optional method to modify the value to be stored
 *
 * See https://github.com/lbryio/lbry-redux/blob/master/src/redux/middleware/shared-state.js for the source
 * This is based off v0.1
 * If lbry-redux changes to another version, this code will need to be changed when upgrading
 */
const sharedStateFilters = {
  tags: { source: 'tags', property: 'followedTags' },
  subscriptions: {
    source: 'subscriptions',
    property: 'subscriptions',
    transform: (value) => {
      return value.map(({ uri }) => uri);
    },
  },
  following: {
    source: 'subscriptions',
    property: 'following',
  },
  blocked: { source: 'blocked', property: 'blockedChannels' },
  coin_swap_codes: {
    source: 'coinSwap',
    property: 'coinSwaps',
    transform: (coinSwaps) => {
      return coinSwaps.map((coinSwapInfo) => coinSwapInfo.chargeCode);
    },
  },
  settings: { source: 'settings', property: 'sharedPreferences' },
  app_welcome_version: { source: 'app', property: 'welcomeVersion' },
  sharing_3P: { source: 'app', property: 'allowAnalytics' },
  builtinCollections: { source: 'collections', property: 'builtin' },
  editedCollections: { source: 'collections', property: 'edited' },
  updatedCollections: { source: 'collections', property: 'updated' },
  savedCollectionIds: { source: 'collections', property: 'savedIds' },
  unpublishedCollections: { source: 'collections', property: 'unpublished' },
  lastViewedAnnouncement: { source: 'content', property: 'lastViewedAnnouncement' },
};

const sharedStateCb = ({ dispatch, getState, syncId }) => {
  dispatch(doSyncLoop(false, syncId));
};

export const sharedStateMiddleware = buildSharedStateMiddleware(
  triggerSharedStateActions,
  sharedStateFilters,
  sharedStateCb
);
