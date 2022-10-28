// @flow
import * as ACTIONS from 'constants/action_types';
import { v4 as uuid } from 'uuid';
import Lbry from 'lbry';
import { doClaimSearch, doAbandonClaim } from 'redux/actions/claims';
import { selectClaimForClaimId, selectClaimForId, makeSelectMetadataItemForUri } from 'redux/selectors/claims';
import {
  selectCollectionForId,
  selectPublishedCollectionForId,
  selectUnpublishedCollectionForId,
  selectEditedCollectionForId,
  selectHasItemsInQueue,
  selectCollectionHasEditsForId,
  selectUrlsForCollectionId,
  selectCollectionSavedForId,
} from 'redux/selectors/collections';
import * as COLS from 'constants/collections';
import { resolveAuxParams, resolveCollectionType } from 'util/collections';
import { getThumbnailFromClaim } from 'util/claim';
import { parseClaimIdFromPermanentUrl } from 'util/url';
import { doToast } from 'redux/actions/notifications';

const FETCH_BATCH_SIZE = 50;

export const doLocalCollectionCreate = (params: CollectionCreateParams, cb?: (id: any) => void) => (
  dispatch: Dispatch,
  getState: GetState
) => {
  const { items, sourceId } = params;

  const id = uuid(); // start with a uuid, this becomes a claimId after publish
  if (cb) cb(id);

  if (sourceId) {
    const state = getState();
    const sourceCollectionItems = selectUrlsForCollectionId(state, sourceId);
    const sourceCollection = selectCollectionForId(state, sourceId);
    const sourceCollectionClaim = selectClaimForId(state, sourceId);
    const sourceDescription =
      sourceCollection.description ||
      makeSelectMetadataItemForUri(sourceCollectionClaim?.canonical_url, 'description')(state);
    const thumbnailUrl = sourceCollection.thumbnail?.url || getThumbnailFromClaim(sourceCollectionClaim);

    return dispatch({
      type: ACTIONS.COLLECTION_NEW,
      data: {
        entry: {
          ...params,
          id: id,
          items: sourceCollectionItems,
          description: sourceDescription,
          thumbnail: { url: thumbnailUrl },
        },
      },
    });
  }

  return dispatch({
    type: ACTIONS.COLLECTION_NEW,
    data: {
      entry: {
        id: id,
        items: items || [],
        ...params,
      },
    },
  });
};

export const doCollectionDelete = (id: string, colKey: ?string = undefined) => (
  dispatch: Dispatch,
  getState: GetState
) => {
  const state = getState();
  const claim = selectClaimForClaimId(state, id);
  const collectionDelete = () =>
    dispatch({
      type: ACTIONS.COLLECTION_DELETE,
      data: {
        id: id,
        collectionKey: colKey,
      },
    });

  if (claim) {
    return dispatch(doAbandonClaim(claim, collectionDelete));
  }

  return collectionDelete();
};

export const doToggleCollectionSavedForId = (collectionId: string) => (dispatch: Dispatch, getState: GetState) => {
  const state = getState();
  const isSaved = selectCollectionSavedForId(state, collectionId);

  dispatch(doToast({ message: !isSaved ? __('Added to saved Playlists!') : __('Removed from saved Playlists.') }));
  dispatch({ type: ACTIONS.COLLECTION_TOGGLE_SAVE, data: { collectionId } });
};

function isPrivateCollectionId(collectionId: string) {
  // Private (unpublished) collections uses UUID.
  return collectionId.includes('-');
}

export const doFetchItemsInCollections = (resolveItemsOptions: {
  collectionIds: Array<string>,
  pageSize?: number,
}) => async (dispatch: Dispatch, getState: GetState) => {
  /*
  1) make sure all the collection claims are loaded into claims reducer, search/resolve if necessary.
  2) get the item claims for each
  3) format and make sure they're in the order as in the claim
  4) Build the collection objects and update collections reducer
  5) Update redux claims reducer
   */
  let state = getState();
  const { collectionIds, pageSize } = resolveItemsOptions;

  dispatch({ type: ACTIONS.COLLECTION_ITEMS_RESOLVE_STARTED, data: { ids: collectionIds } });

  const privateCollectionIds = [];
  const collectionIdsToSearch = [];

  // -- Fill up 'privateCollectionIds' and 'collectionIdsToSearch':
  collectionIds.forEach((id) => {
    if (isPrivateCollectionId(id)) {
      privateCollectionIds.push(id);
    } else if (!selectClaimForId(state, id)) {
      collectionIdsToSearch.push(id);
    }
  });

  // -- Resolve collections:
  if (collectionIdsToSearch.length) {
    await dispatch(
      doClaimSearch(
        { claim_ids: collectionIdsToSearch, page: 1, page_size: 50, no_totals: true },
        { useAutoPagination: true }
      )
    );
    state = getState();
  }

  async function fetchItemsForCollectionClaim(
    collectionId: string,
    totalItems: number,
    itemIdsInOrder: Array<string>,
    pageSize?: number
  ) {
    const sortResults = (items: Array<Claim>, claimList) => {
      const newItems: Array<Claim> = [];
      claimList.forEach((id) => {
        const index = items.findIndex((i) => i.claim_id === id);
        if (index >= 0) {
          newItems.push(items[index]);
        }
      });
      /*
        This will return newItems[] of length less than total_items below
        if one or more of the claims has been abandoned. That's ok for now.
      */
      return newItems;
    };

    const mergeBatches = (
      arrayOfResults: Array<{ items: Array<Claim>, total_items: number }>,
      claimList: Array<string>
    ) => {
      const mergedResults: { items: Array<Claim>, total_items: number } = {
        items: [],
        total_items: 0,
      };
      arrayOfResults.forEach((result) => {
        mergedResults.items = mergedResults.items.concat(result.items);
        mergedResults.total_items = result.total_items;
      });

      mergedResults.items = sortResults(mergedResults.items, claimList);
      return mergedResults;
    };

    try {
      const batchSize = pageSize || FETCH_BATCH_SIZE;
      const batches: Array<Promise<any>> = [];

      for (let i = 0; i < Math.ceil(totalItems / batchSize); i++) {
        batches[i] = Lbry.claim_search({
          claim_ids: itemIdsInOrder.slice(i * batchSize, (i + 1) * batchSize),
          page: 1,
          page_size: batchSize,
          no_totals: true,
        });
      }
      const itemsInBatches = await Promise.all(batches);
      const result = mergeBatches(itemsInBatches, itemIdsInOrder);

      // $FlowFixMe
      const itemsById: { claimId: string, items?: ?Array<GenericClaim> } = { claimId: collectionId };
      if (result.items) {
        itemsById.items = result.items;
      } else {
        itemsById.items = null;
      }
      return itemsById;
    } catch (e) {
      return {
        claimId: collectionId,
        items: null,
      };
    }
  }

  const invalidCollectionIds = [];
  const promisedCollectionItemFetches = [];
  let collectionItemsById: Array<CollectionItemFetchResult> = [];

  // -- Collect requests for resolving items in each collection:
  collectionIds.forEach((collectionId) => {
    const hasEdits = selectCollectionHasEditsForId(state, collectionId);

    if (isPrivateCollectionId(collectionId) || hasEdits) {
      const collection = selectCollectionForId(state, collectionId);
      if (collection?.items.length > 0) {
        promisedCollectionItemFetches.push(
          fetchItemsForCollectionClaim(
            collectionId,
            collection.items.length,
            collection.items.map((url) => parseClaimIdFromPermanentUrl(url, 'junk')),
            pageSize
          )
        );
      } else {
        const collectionItem: CollectionItemFetchResult = { claimId: collectionId, items: [] };
        collectionItemsById.push(collectionItem);
      }
    }

    const claim = selectClaimForClaimId(state, collectionId);
    if (!claim) {
      invalidCollectionIds.push(collectionId);
    } else {
      promisedCollectionItemFetches.push(
        fetchItemsForCollectionClaim(
          collectionId,
          claim.value.claims && claim.value.claims.length,
          claim.value.claims,
          pageSize
        )
      );
    }
  });

  // -- Await results:
  if (promisedCollectionItemFetches.length > 0) collectionItemsById = await Promise.all(promisedCollectionItemFetches);

  const newCollectionObjectsById = {};
  const resolvedItemsByUrl = {};

  // -- Process results:
  collectionItemsById.forEach((entry) => {
    // $FlowFixMe
    const collectionItems: Array<any> = entry.items;
    const collectionId = entry.claimId;

    if (isPrivateCollectionId(collectionId) && collectionItems) {
      // Nothing to do for now. We are only interested in getting the resolved
      // data for each item in the private collection.
    } else if (collectionItems) {
      const claim = selectClaimForClaimId(state, collectionId);

      const { items: editedCollectionItems } = selectEditedCollectionForId(state, collectionId) || {};
      const { name, timestamp, value } = claim || {};
      const { title, description, thumbnail } = value;
      const valueTypes = new Set();
      const streamTypes = new Set();

      let newItems = [];
      let collectionType;

      if (collectionItems) {
        collectionItems.forEach((collectionItem) => {
          newItems.push(collectionItem.permanent_url);
          valueTypes.add(collectionItem.value_type);
          if (collectionItem.value.stream_type) {
            streamTypes.add(collectionItem.value.stream_type);
          }
          resolvedItemsByUrl[collectionItem.canonical_url] = collectionItem;
        });

        collectionType = resolveCollectionType(value.tags, valueTypes, streamTypes);
      }

      newCollectionObjectsById[collectionId] = {
        items: newItems,
        id: collectionId,
        name: title || name,
        itemCount: claim.value.claims.length,
        type: collectionType,
        createdAt: claim.meta?.creation_timestamp,
        updatedAt: timestamp,
        description,
        thumbnail,
        key: editedCollectionItems === collectionItems ? 'edited' : undefined,
        ...resolveAuxParams(collectionType, claim),
      };
    } else {
      invalidCollectionIds.push(collectionId);
    }
  });

  const resolveInfo: ClaimActionResolveInfo = {};

  const resolveReposts = true;

  collectionItemsById.forEach((collection) => {
    // GenericClaim type probably needs to be updated to avoid this "Any"
    collection.items &&
      collection.items.forEach((result: any) => {
        result = { [result.canonical_url]: result };
        processResult(result, resolveInfo, resolveReposts);
      });
  });

  dispatch({ type: ACTIONS.RESOLVE_URIS_SUCCESS, data: { resolveInfo } });

  dispatch({
    type: ACTIONS.COLLECTION_ITEMS_RESOLVE_COMPLETED,
    data: {
      resolvedPrivateCollectionIds: privateCollectionIds,
      resolvedCollections: newCollectionObjectsById,
      failedCollectionIds: invalidCollectionIds,
    },
  });
};

function processResult(result, resolveInfo = {}, checkReposts = false) {
  const fallbackResolveInfo = {
    stream: null,
    claimsInChannel: null,
    channel: null,
  };

  Object.entries(result).forEach(([uri, uriResolveInfo]) => {
    // Flow has terrible Object.entries support
    // https://github.com/facebook/flow/issues/2221
    if (uriResolveInfo) {
      if (uriResolveInfo.error) {
        // $FlowFixMe
        resolveInfo[uri] = { ...fallbackResolveInfo };
      } else {
        let result = {};
        if (uriResolveInfo.value_type === 'channel') {
          result.channel = uriResolveInfo;
          // $FlowFixMe
          result.claimsInChannel = uriResolveInfo.meta.claims_in_channel;
        } else if (uriResolveInfo.value_type === 'collection') {
          result.collection = uriResolveInfo;
          // $FlowFixMe
        } else {
          result.stream = uriResolveInfo;
          if (uriResolveInfo.signing_channel) {
            result.channel = uriResolveInfo.signing_channel;
            result.claimsInChannel =
              (uriResolveInfo.signing_channel.meta && uriResolveInfo.signing_channel.meta.claims_in_channel) || 0;
          }
        }
        // $FlowFixMe
        resolveInfo[uri] = result;
      }
    }
  });
}

export const doFetchItemsInCollection = (options: { collectionId: string, pageSize?: number }) => {
  const { collectionId, pageSize } = options;
  const newOptions: { collectionIds: Array<string>, pageSize?: number } = {
    collectionIds: [collectionId],
  };
  if (pageSize) newOptions.pageSize = pageSize;

  return doFetchItemsInCollections(newOptions);
};

export const doCollectionEdit = (collectionId: string, params: CollectionEditParams) => (
  dispatch: Dispatch,
  getState: GetState
) => {
  const state = getState();
  const collection: Collection = selectCollectionForId(state, collectionId);

  if (!collection) {
    return dispatch({
      type: ACTIONS.COLLECTION_ERROR,
      data: { message: 'collection does not exist' },
    });
  }

  const editedCollection: Collection = selectEditedCollectionForId(state, collectionId);
  const unpublishedCollection: Collection = selectUnpublishedCollectionForId(state, collectionId);
  const publishedCollection: Collection = selectPublishedCollectionForId(state, collectionId); // needs to be published only

  const { uris, remove, replace, order, type } = params;

  const currentUrls = collection.items ? collection.items.concat() : [];
  let newItems = currentUrls;

  // Passed uris to add/remove:
  if (uris) {
    if (replace) {
      newItems = uris;
    } else if (remove) {
      // Filters (removes) the passed uris from the current list items
      // $FlowFixMe
      newItems = currentUrls.filter((url) => url && !uris?.includes(url));
    } else {
      // Pushes (adds to the end) the passed uris to the current list items
      // (only if item not already in currentUrls, avoid duplicates)
      uris.forEach((url) => !currentUrls.includes(url) && newItems.push(url));
    }
  } else if (remove) {
    // no uris and remove === true: clear the list
    newItems = [];
  }

  // Passed an ordering to change: (doesn't need the uris here since
  // the items are already on the list)
  if (order) {
    const [movedItem] = currentUrls.splice(order.from, 1);
    currentUrls.splice(order.to, 0, movedItem);
  }

  const isQueue = collectionId === COLS.QUEUE_ID;
  const collectionKey =
    (isQueue && COLS.QUEUE_ID) ||
    ((editedCollection || publishedCollection) && COLS.COL_KEY_EDITED) ||
    (COLS.BUILTIN_PLAYLISTS.includes(collectionId) && COLS.COL_KEY_BUILTIN) ||
    (unpublishedCollection && COLS.COL_KEY_UNPUBLISHED);

  return dispatch({
    type: isQueue ? ACTIONS.QUEUE_EDIT : ACTIONS.COLLECTION_EDIT,
    data: {
      collectionKey,
      collection: {
        ...collection,
        items: newItems,
        ...(type ? { type } : {}),
        ...(params.name ? { name: params.name } : {}),
        ...(params.description ? { description: params.description } : {}),
        ...(params.thumbnail ? { thumbnail: params.thumbnail } : {}),
      },
    },
  });
};

export const doClearEditsForCollectionId = (id: String) => (dispatch: Dispatch) => {
  dispatch({ type: ACTIONS.COLLECTION_DELETE, data: { id, collectionKey: 'edited' } });

  dispatch({
    type: ACTIONS.COLLECTION_EDIT,
    data: { collectionKey: COLS.COL_KEY_UPDATED, collection: { id } },
  });
};

export const doClearQueueList = () => (dispatch: Dispatch, getState: GetState) => {
  const state = getState();
  const hasItemsInQueue = selectHasItemsInQueue(state);

  if (hasItemsInQueue) {
    return dispatch(doCollectionEdit(COLS.QUEUE_ID, { remove: true, type: COLS.COL_TYPES.PLAYLIST }));
  }
};
