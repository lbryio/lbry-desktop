// @flow
import * as ACTIONS from 'constants/action_types';
import { v4 as uuid } from 'uuid';
import Lbry from 'lbry';
import { doClaimSearch, doAbandonClaim } from 'redux/actions/claims';
import { makeSelectClaimForClaimId } from 'redux/selectors/claims';
import {
  makeSelectCollectionForId,
  // makeSelectPublishedCollectionForId, // for "save" or "copy" action
  makeSelectPublishedCollectionForId,
  makeSelectUnpublishedCollectionForId,
  makeSelectEditedCollectionForId,
} from 'redux/selectors/collections';
import * as COLS from 'constants/collections';

const getTimestamp = () => {
  return Math.floor(Date.now() / 1000);
};

const FETCH_BATCH_SIZE = 50;

export const doLocalCollectionCreate = (
  name: string,
  collectionItems: Array<string>,
  type: string,
  sourceId: string
) => (dispatch: Dispatch) => {
  return dispatch({
    type: ACTIONS.COLLECTION_NEW,
    data: {
      entry: {
        id: uuid(), // start with a uuid, this becomes a claimId after publish
        name: name,
        updatedAt: getTimestamp(),
        items: collectionItems || [],
        sourceId: sourceId,
        type: type,
      },
    },
  });
};

export const doCollectionDelete = (id: string, colKey: ?string = undefined) => (
  dispatch: Dispatch,
  getState: GetState
) => {
  const state = getState();
  const claim = makeSelectClaimForClaimId(id)(state);
  const collectionDelete = () =>
    dispatch({
      type: ACTIONS.COLLECTION_DELETE,
      data: {
        id: id,
        collectionKey: colKey,
      },
    });
  if (claim && !colKey) {
    // could support "abandon, but keep" later
    const { txid, nout } = claim;
    return dispatch(doAbandonClaim(txid, nout, collectionDelete));
  }
  return collectionDelete();
};

// Given a collection, save its collectionId to be resolved and displayed in Library
// export const doCollectionSave = (
//   id: string,
// ) => (dispatch: Dispatch) => {
//   return dispatch({
//     type: ACTIONS.COLLECTION_SAVE,
//     data: {
//       id: id,
//     },
//   });
// };

// Given a collection and name, copy it to a local private collection with a name
// export const doCollectionCopy = (
//   id: string,
// ) => (dispatch: Dispatch) => {
//   return dispatch({
//     type: ACTIONS.COLLECTION_COPY,
//     data: {
//       id: id,
//     },
//   });
// };

export const doFetchItemsInCollections = (
  resolveItemsOptions: {
    collectionIds: Array<string>,
    pageSize?: number,
  },
  resolveStartedCallback?: () => void
) => async (dispatch: Dispatch, getState: GetState) => {
  /*
  1) make sure all the collection claims are loaded into claims reducer, search/resolve if necessary.
  2) get the item claims for each
  3) format and make sure they're in the order as in the claim
  4) Build the collection objects and update collections reducer
  5) Update redux claims reducer
   */
  let state = getState();
  const { collectionIds, pageSize } = resolveItemsOptions;

  dispatch({
    type: ACTIONS.COLLECTION_ITEMS_RESOLVE_STARTED,
    data: { ids: collectionIds },
  });

  if (resolveStartedCallback) resolveStartedCallback();

  const collectionIdsToSearch = collectionIds.filter((claimId) => !state.claims.byId[claimId]);

  if (collectionIdsToSearch.length) {
    await dispatch(doClaimSearch({ claim_ids: collectionIdsToSearch, page: 1, page_size: 9999 }));
  }

  const stateAfterClaimSearch = getState();

  async function fetchItemsForCollectionClaim(claim: CollectionClaim, pageSize?: number) {
    const totalItems = claim.value.claims && claim.value.claims.length;
    const claimId = claim.claim_id;
    const itemOrder = claim.value.claims;

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
          claim_ids: claim.value.claims,
          page: i + 1,
          page_size: batchSize,
          no_totals: true,
        });
      }
      const itemsInBatches = await Promise.all(batches);
      const result = mergeBatches(itemsInBatches, itemOrder);

      // $FlowFixMe
      const itemsById: { claimId: string, items?: ?Array<GenericClaim> } = { claimId: claimId };
      if (result.items) {
        itemsById.items = result.items;
      } else {
        itemsById.items = null;
      }
      return itemsById;
    } catch (e) {
      return {
        claimId: claimId,
        items: null,
      };
    }
  }

  function formatForClaimActions(resultClaimsByUri) {
    const formattedClaims = {};
    Object.entries(resultClaimsByUri).forEach(([uri, uriResolveInfo]) => {
      // Flow has terrible Object.entries support
      // https://github.com/facebook/flow/issues/2221
      if (uriResolveInfo) {
        let result = {};
        if (uriResolveInfo.value_type === 'channel') {
          result.channel = uriResolveInfo;
          // $FlowFixMe
          result.claimsInChannel = uriResolveInfo.meta.claims_in_channel;
          // ALSO SKIP COLLECTIONS
        } else if (uriResolveInfo.value_type === 'collection') {
          result.collection = uriResolveInfo;
        } else {
          result.stream = uriResolveInfo;
          if (uriResolveInfo.signing_channel) {
            result.channel = uriResolveInfo.signing_channel;
            result.claimsInChannel =
              (uriResolveInfo.signing_channel.meta && uriResolveInfo.signing_channel.meta.claims_in_channel) || 0;
          }
        }
        // $FlowFixMe
        formattedClaims[uri] = result;
      }
    });
    return formattedClaims;
  }

  const invalidCollectionIds = [];
  const promisedCollectionItemFetches = [];
  collectionIds.forEach((collectionId) => {
    const claim = makeSelectClaimForClaimId(collectionId)(stateAfterClaimSearch);
    if (!claim) {
      invalidCollectionIds.push(collectionId);
    } else {
      promisedCollectionItemFetches.push(fetchItemsForCollectionClaim(claim, pageSize));
    }
  });

  // $FlowFixMe
  const collectionItemsById: Array<{
    claimId: string,
    items: ?Array<GenericClaim>,
  }> = await Promise.all(promisedCollectionItemFetches);

  const newCollectionObjectsById = {};
  const resolvedItemsByUrl = {};
  collectionItemsById.forEach((entry) => {
    // $FlowFixMe
    const collectionItems: Array<any> = entry.items;
    const collectionId = entry.claimId;
    if (collectionItems) {
      const claim = makeSelectClaimForClaimId(collectionId)(stateAfterClaimSearch);

      const editedCollection = makeSelectEditedCollectionForId(collectionId)(stateAfterClaimSearch);
      const { name, timestamp, value } = claim || {};
      const { title } = value;
      const valueTypes = new Set();
      const streamTypes = new Set();

      let newItems = [];
      let isPlaylist;

      if (collectionItems) {
        collectionItems.forEach((collectionItem) => {
          newItems.push(collectionItem.permanent_url);
          valueTypes.add(collectionItem.value_type);
          if (collectionItem.value.stream_type) {
            streamTypes.add(collectionItem.value.stream_type);
          }
          resolvedItemsByUrl[collectionItem.canonical_url] = collectionItem;
        });
        isPlaylist =
          valueTypes.size === 1 &&
          valueTypes.has('stream') &&
          ((streamTypes.size === 1 && (streamTypes.has('audio') || streamTypes.has('video'))) ||
            (streamTypes.size === 2 && streamTypes.has('audio') && streamTypes.has('video')));
      }

      newCollectionObjectsById[collectionId] = {
        items: newItems,
        id: collectionId,
        name: title || name,
        itemCount: claim.value.claims.length,
        type: isPlaylist ? 'playlist' : 'collection',
        updatedAt: timestamp,
      };

      if (editedCollection && timestamp > editedCollection['updatedAt']) {
        dispatch({
          type: ACTIONS.COLLECTION_DELETE,
          data: {
            id: collectionId,
            collectionKey: 'edited',
          },
        });
      }
    } else {
      invalidCollectionIds.push(collectionId);
    }
  });
  const formattedClaimsByUri = formatForClaimActions(collectionItemsById);

  dispatch({
    type: ACTIONS.RESOLVE_URIS_COMPLETED,
    data: { resolveInfo: formattedClaimsByUri },
  });

  dispatch({
    type: ACTIONS.COLLECTION_ITEMS_RESOLVE_COMPLETED,
    data: {
      resolvedCollections: newCollectionObjectsById,
      failedCollectionIds: invalidCollectionIds,
    },
  });
};

export const doFetchItemsInCollection = (options: { collectionId: string, pageSize?: number }, cb?: () => void) => {
  const { collectionId, pageSize } = options;
  const newOptions: { collectionIds: Array<string>, pageSize?: number } = {
    collectionIds: [collectionId],
  };
  if (pageSize) newOptions.pageSize = pageSize;
  return doFetchItemsInCollections(newOptions, cb);
};

export const doCollectionEdit = (collectionId: string, params: CollectionEditParams) => async (
  dispatch: Dispatch,
  getState: GetState
) => {
  const state = getState();
  const collection: Collection = makeSelectCollectionForId(collectionId)(state);
  const editedCollection: Collection = makeSelectEditedCollectionForId(collectionId)(state);
  const unpublishedCollection: Collection = makeSelectUnpublishedCollectionForId(collectionId)(state);
  const publishedCollection: Collection = makeSelectPublishedCollectionForId(collectionId)(state); // needs to be published only

  const generateCollectionItemsFromSearchResult = (results) => {
    return (
      Object.values(results)
        // $FlowFixMe
        .reduce(
          (
            acc,
            cur: {
              stream: ?StreamClaim,
              channel: ?ChannelClaim,
              claimsInChannel: ?number,
              collection: ?CollectionClaim,
            }
          ) => {
            let url;
            if (cur.stream) {
              url = cur.stream.permanent_url;
            } else if (cur.channel) {
              url = cur.channel.permanent_url;
            } else if (cur.collection) {
              url = cur.collection.permanent_url;
            } else {
              return acc;
            }
            acc.push(url);
            return acc;
          },
          []
        )
    );
  };

  if (!collection) {
    return dispatch({
      type: ACTIONS.COLLECTION_ERROR,
      data: {
        message: 'collection does not exist',
      },
    });
  }

  let currentItems = collection.items ? collection.items.concat() : [];
  const { claims: passedClaims, order, claimIds, replace, remove, type } = params;

  const collectionType = type || collection.type;
  let newItems: Array<?string> = currentItems;

  if (passedClaims) {
    if (remove) {
      const passedUrls = passedClaims.map((claim) => claim.permanent_url);
      // $FlowFixMe // need this?
      newItems = currentItems.filter((item: string) => !passedUrls.includes(item));
    } else {
      passedClaims.forEach((claim) => newItems.push(claim.permanent_url));
    }
  }

  if (claimIds) {
    const batches = [];
    if (claimIds.length > 50) {
      for (let i = 0; i < Math.ceil(claimIds.length / 50); i++) {
        batches[i] = claimIds.slice(i * 50, (i + 1) * 50);
      }
    } else {
      batches[0] = claimIds;
    }
    const resultArray = await Promise.all(
      batches.map((batch) => {
        let options = { claim_ids: batch, page: 1, page_size: 50 };
        return dispatch(doClaimSearch(options));
      })
    );

    const searchResults = Object.assign({}, ...resultArray);

    if (replace) {
      newItems = generateCollectionItemsFromSearchResult(searchResults);
    } else {
      newItems = currentItems.concat(generateCollectionItemsFromSearchResult(searchResults));
    }
  }

  if (order) {
    const [movedItem] = currentItems.splice(order.from, 1);
    currentItems.splice(order.to, 0, movedItem);
  }

  // console.log('p&e', publishedCollection.items, newItems, publishedCollection.items.join(','), newItems.join(','))
  if (editedCollection) {
    // delete edited if newItems are the same as publishedItems
    if (publishedCollection.items.join(',') === newItems.join(',')) {
      dispatch({
        type: ACTIONS.COLLECTION_DELETE,
        data: {
          id: collectionId,
          collectionKey: 'edited',
        },
      });
    } else {
      dispatch({
        type: ACTIONS.COLLECTION_EDIT,
        data: {
          id: collectionId,
          collectionKey: 'edited',
          collection: {
            items: newItems,
            id: collectionId,
            name: params.name || collection.name,
            updatedAt: getTimestamp(),
            type: collectionType,
          },
        },
      });
    }
  } else if (publishedCollection) {
    dispatch({
      type: ACTIONS.COLLECTION_EDIT,
      data: {
        id: collectionId,
        collectionKey: 'edited',
        collection: {
          items: newItems,
          id: collectionId,
          name: params.name || collection.name,
          updatedAt: getTimestamp(),
          type: collectionType,
        },
      },
    });
  } else if (COLS.BUILTIN_LISTS.includes(collectionId)) {
    dispatch({
      type: ACTIONS.COLLECTION_EDIT,
      data: {
        id: collectionId,
        collectionKey: 'builtin',
        collection: {
          items: newItems,
          id: collectionId,
          name: params.name || collection.name,
          updatedAt: getTimestamp(),
          type: collectionType,
        },
      },
    });
  } else if (unpublishedCollection) {
    dispatch({
      type: ACTIONS.COLLECTION_EDIT,
      data: {
        id: collectionId,
        collectionKey: 'unpublished',
        collection: {
          items: newItems,
          id: collectionId,
          name: params.name || collection.name,
          updatedAt: getTimestamp(),
          type: collectionType,
        },
      },
    });
  }
  return true;
};
