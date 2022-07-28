// @flow
import { handleActions } from 'util/redux-utils';
import { getCurrentTimeInSec } from 'util/time';
import * as ACTIONS from 'constants/action_types';
import * as COLS from 'constants/collections';

const defaultState: CollectionState = {
  builtin: {
    watchlater: {
      items: [],
      id: COLS.WATCH_LATER_ID,
      name: COLS.WATCH_LATER_NAME,
      createdAt: undefined,
      updatedAt: getCurrentTimeInSec(),
      type: COLS.COL_TYPES.PLAYLIST,
    },
    favorites: {
      items: [],
      id: COLS.FAVORITES_ID,
      name: COLS.FAVORITES_NAME,
      createdAt: undefined,
      updatedAt: getCurrentTimeInSec(),
      type: COLS.COL_TYPES.PLAYLIST,
    },
  },
  resolved: {},
  unpublished: {}, // sync
  lastUsedCollection: undefined,
  edited: {},
  updated: {},
  pending: {},
  savedIds: [],
  resolvingById: {},
  error: null,
  queue: {
    items: [],
    id: COLS.QUEUE_ID,
    name: COLS.QUEUE_NAME,
    updatedAt: getCurrentTimeInSec(),
    type: COLS.COL_TYPES.PLAYLIST,
  },
};

const collectionsReducer = handleActions(
  {
    [ACTIONS.COLLECTION_NEW]: (state, action) => {
      const { entry: params } = action.data; // { id:, items: Array<string>}
      const currentTime = getCurrentTimeInSec();

      // entry
      const newListTemplate: Collection = {
        id: params.id,
        name: params.name,
        items: [],
        createdAt: currentTime,
        updatedAt: currentTime,
        type: params.type,
      };

      const newList = Object.assign({}, newListTemplate, { ...params });
      const { unpublished: lists } = state;
      const newLists = Object.assign({}, lists, { [params.id]: newList });

      return {
        ...state,
        unpublished: newLists,
        lastUsedCollection: params.id,
      };
    },

    [ACTIONS.COLLECTION_TOGGLE_SAVE]: (state, action) => {
      const { savedIds } = state;
      const { collectionId } = action.data;

      if (savedIds.includes(collectionId)) {
        return { ...state, savedIds: savedIds.filter((savedId) => savedId !== collectionId) };
      } else {
        return { ...state, savedIds: [...savedIds, collectionId] };
      }
    },

    [ACTIONS.COLLECTION_DELETE]: (state, action) => {
      const { edited: editList, unpublished: unpublishedList, pending: pendingList, lastUsedCollection } = state;
      const { id, collectionKey } = action.data;

      const newEditList = Object.assign({}, editList);
      const newPendingList = Object.assign({}, pendingList);
      const newUnpublishedList = Object.assign({}, unpublishedList);

      const collectionsForKey = state[collectionKey];
      const collectionForId = collectionsForKey && collectionsForKey[id];
      const isDeletingLastUsedCollection = lastUsedCollection === id;

      if (collectionForId) {
        const newList = Object.assign({}, state[collectionKey]);
        delete newList[id];
        return {
          ...state,
          [collectionKey]: newList,
          lastUsedCollection: isDeletingLastUsedCollection ? undefined : lastUsedCollection,
        };
      } else if (collectionKey === 'all') {
        delete newEditList[id];
        delete newUnpublishedList[id];
        delete newPendingList[id];
      } else {
        if (newEditList[id]) {
          delete newEditList[id];
        } else if (newUnpublishedList[id]) {
          delete newUnpublishedList[id];
        } else if (newPendingList[id]) {
          delete newPendingList[id];
        }
      }
      return {
        ...state,
        edited: newEditList,
        unpublished: newUnpublishedList,
        pending: newPendingList,
        lastUsedCollection: isDeletingLastUsedCollection ? undefined : lastUsedCollection,
      };
    },

    [ACTIONS.COLLECTION_PENDING]: (state, action) => {
      const { localId, claimId } = action.data;
      const { resolved: resolvedList, edited: editList, unpublished: unpublishedList, pending: pendingList } = state;

      const newEditList = Object.assign({}, editList);
      const newResolvedList = Object.assign({}, resolvedList);
      const newUnpublishedList = Object.assign({}, unpublishedList);
      const newPendingList = Object.assign({}, pendingList);

      if (localId) {
        // new publish
        newPendingList[claimId] = Object.assign({}, newUnpublishedList[localId] || {});
        delete newUnpublishedList[localId];
      } else {
        // edit update
        newPendingList[claimId] = Object.assign({}, newEditList[claimId] || newResolvedList[claimId]);
        delete newEditList[claimId];
      }

      return {
        ...state,
        edited: newEditList,
        unpublished: newUnpublishedList,
        pending: newPendingList,
        lastUsedCollection: claimId,
      };
    },

    [ACTIONS.QUEUE_EDIT]: (state, action) => {
      const { collectionKey, collection } = action.data;

      const { [collectionKey]: currentQueue } = state;

      return { ...state, queue: { ...currentQueue, ...collection, updatedAt: getCurrentTimeInSec() } };
    },

    [ACTIONS.COLLECTION_EDIT]: (state, action) => {
      const { collectionKey, collection } = action.data;
      const id = collection.id;

      const { [collectionKey]: currentCollections } = state;

      const newCollection = Object.assign({}, collection);
      newCollection.updatedAt = getCurrentTimeInSec();

      return {
        ...state,
        [collectionKey]: { ...currentCollections, [id]: newCollection },
        lastUsedCollection: id,
      };
    },

    [ACTIONS.COLLECTION_ERROR]: (state, action) => {
      return Object.assign({}, state, {
        error: action.data.message,
      });
    },

    [ACTIONS.COLLECTION_ITEMS_RESOLVE_STARTED]: (state, action) => {
      const { ids } = action.data;
      const { resolvingById } = state;

      const newResolving = Object.assign({}, resolvingById);
      ids.forEach((id) => {
        newResolving[id] = true;
      });

      return { ...state, error: '', resolvingById: newResolving };
    },
    [ACTIONS.USER_STATE_POPULATE]: (state, action) => {
      const {
        builtinCollections,
        savedCollectionIds,
        unpublishedCollections,
        editedCollections,
        updatedCollections,
      } = action.data;

      return {
        ...state,
        edited: editedCollections || state.edited,
        updated: updatedCollections || state.updated,
        unpublished: unpublishedCollections || state.unpublished,
        builtin: builtinCollections || state.builtin,
        savedIds: savedCollectionIds || state.savedIds,
      };
    },
    [ACTIONS.COLLECTION_ITEMS_RESOLVE_COMPLETED]: (state, action) => {
      const { resolvedPrivateCollectionIds, resolvedCollections, failedCollectionIds } = action.data;
      const { pending, edited, resolvingById, resolved, updated } = state;

      const resolvedFiltered = {};
      const editedResolved = {};
      Object.entries(resolvedCollections).forEach(([key, val]) => {
        // $FlowFixMe
        if (val.key !== 'edited') {
          resolvedFiltered[key] = val;
        } else {
          editedResolved[key] = val;
        }
      });

      const newPending = Object.assign({}, pending);
      const newResolved = Object.assign({}, resolved, resolvedFiltered);
      const newEdited = Object.assign({}, edited, editedResolved);

      const resolvedIds = Object.keys(resolvedCollections);
      const newResolving = Object.assign({}, resolvingById);
      if (resolvedCollections && Object.keys(resolvedCollections).length) {
        resolvedIds.forEach((resolvedId) => {
          if (updated[resolvedId]) {
            if (updated[resolvedId]['updatedAt'] < resolvedCollections[resolvedId]['updatedAt']) {
              delete updated[resolvedId];
            }
          }
          delete newResolving[resolvedId];
          if (newPending[resolvedId]) {
            delete newPending[resolvedId];
          }
        });
      }

      if (failedCollectionIds && Object.keys(failedCollectionIds).length) {
        failedCollectionIds.forEach((failedId) => {
          delete newResolving[failedId];
        });
      }

      if (resolvedPrivateCollectionIds && resolvedPrivateCollectionIds.length > 0) {
        resolvedPrivateCollectionIds.forEach((id) => {
          delete newResolving[id];
        });
      }

      return Object.assign({}, state, {
        ...state,
        pending: newPending,
        resolved: newResolved,
        edited: newEdited,
        resolvingById: newResolving,
      });
    },
    [ACTIONS.COLLECTION_ITEMS_RESOLVE_FAILED]: (state, action) => {
      const { ids } = action.data;
      const { resolvingById } = state;
      const newResolving = Object.assign({}, resolvingById);
      ids.forEach((id) => {
        delete newResolving[id];
      });
      return Object.assign({}, state, {
        ...state,
        resolvingById: newResolving,
        error: action.data.message,
      });
    },
  },
  defaultState
);

export { collectionsReducer };
