// @flow
import fromEntries from '@ungap/from-entries';
import { createSelector } from 'reselect';
import * as COLLECTIONS_CONSTS from 'constants/collections';
import { COL_TYPES } from 'constants/collections';
import moment from 'moment';
import {
  selectMyCollectionIds,
  selectClaimForUri,
  selectClaimForClaimId,
  selectChannelNameForId,
  selectPermanentUrlForUri,
  selectClaimsById,
} from 'redux/selectors/claims';
import { parseURI } from 'util/lbryURI';
import { createCachedSelector } from 're-reselect';
import { selectUserCreationDate } from 'redux/selectors/user';
import { selectPlayingCollection } from 'redux/selectors/content';
import { selectCountForCollection } from 'util/collections';
import { getChannelIdFromClaim, isPermanentUrl } from 'util/claim';

type State = { collections: CollectionState };

const selectState = (state: State) => state.collections || {};

export const selectSavedCollectionIds = (state: State) => selectState(state).savedIds;
export const selectBuiltinCollections = (state: State) => selectState(state).builtin;
export const selectResolvedCollections = (state: State) => selectState(state).resolved;
export const selectMyUnpublishedCollections = (state: State) => selectState(state).unpublished;
export const selectMyEditedCollections = (state: State) => selectState(state).edited;
export const selectMyUpdatedCollections = (state: State) => selectState(state).updated;
export const selectPendingCollections = (state: State) => selectState(state).pending;
export const selectIsResolvingCollectionById = (state: State) => selectState(state).resolvingById;
export const selectQueueCollection = (state: State) => selectState(state).queue;

export const selectCurrentQueueList = createSelector(selectQueueCollection, (queue) => ({ queue }));
export const selectHasItemsInQueue = createSelector(selectQueueCollection, (queue) => queue.items.length > 0);

export const selectLastUsedCollection = createSelector(selectState, (state) => state.lastUsedCollection);

export const selectUnpublishedCollectionsList = createSelector(
  selectMyUnpublishedCollections,
  (unpublishedCollections) => Object.keys(unpublishedCollections || {})
);

export const selectCollectionSavedForId = (state: State, id: string) => {
  const savedIds = selectSavedCollectionIds(state);
  return savedIds.includes(id);
};

export const selectSavedCollections = createSelector(
  selectResolvedCollections,
  selectSavedCollectionIds,
  (resolved, savedIds) => fromEntries(Object.entries(resolved).filter(([key, val]) => savedIds.includes(key)))
);

export const selectHasCollections = createSelector(
  selectUnpublishedCollectionsList,
  selectMyCollectionIds,
  (unpublished, publishedIds) => Boolean(unpublished.length > 0 || publishedIds.length > 0)
);

export const selectEditedCollectionForId = (state: State, id: string) => {
  const editedCollections = selectMyEditedCollections(state);
  return editedCollections[id];
};

export const selectUpdatedCollectionForId = (state: State, id: string) => {
  const editedCollections = selectMyEditedCollections(state);
  if (editedCollections[id]) return editedCollections[id];

  const updatedCollections = selectMyUpdatedCollections(state);
  return updatedCollections[id];
};

export const selectCollectionNameForId = (state: State, id: string) => {
  const collection = selectCollectionForId(state, id);
  return collection?.name;
};

export const selectCollectionDescriptionForId = (state: State, id: string) => {
  const collection = selectCollectionForId(state, id);
  return collection?.description;
};

export const selectCollectionHasEditsForId = (state: State, id: string) => {
  const editedCollections = selectMyEditedCollections(state);
  return Boolean(editedCollections[id]);
};

export const selectPendingCollectionForId = (state: State, id: string) => {
  const pendingCollections = selectPendingCollections(state);
  return pendingCollections[id];
};

export const selectPublishedCollectionForId = (state: State, id: string) => {
  const publishedCollections = selectResolvedCollections(state);
  return publishedCollections[id];
};

export const selectPublishedCollectionClaimForId = (state: any, id: string) => {
  const publishedCollection = selectPublishedCollectionForId(state, id);

  if (publishedCollection) {
    const claim = selectClaimForClaimId(state, id);
    return claim;
  }

  return null;
};

export const selectPublishedCollectionChannelNameForId = (state: any, id: string) => {
  const collectionClaim = selectPublishedCollectionClaimForId(state, id);

  if (collectionClaim) {
    const name = selectChannelNameForId(state, id);
    return name;
  }

  return null;
};

export const selectUnpublishedCollectionForId = (state: State, id: string) => {
  const unpublishedCollections = selectMyUnpublishedCollections(state);
  return unpublishedCollections[id];
};

export const selectCollectionIsMine = createSelector(
  (state, id) => id,
  selectMyCollectionIds,
  selectMyUnpublishedCollections,
  selectBuiltinCollections,
  selectCurrentQueueList,
  (id, publicIds, privateIds, builtinIds, queue) =>
    Boolean(publicIds.includes(id) || privateIds[id] || builtinIds[id] || queue[id])
);

export const selectMyPublishedCollections = createSelector(
  selectResolvedCollections,
  selectPendingCollections,
  selectMyEditedCollections,
  selectMyUpdatedCollections,
  selectMyCollectionIds,
  (resolved, pending, edited, updated, myIds) => {
    // all resolved in myIds, plus those in pending and edited
    const myPublishedCollections = fromEntries(
      Object.entries(pending).concat(
        Object.entries(resolved).filter(
          ([key, val]) =>
            myIds.includes(key) &&
            // $FlowFixMe
            !pending[key]
        )
      )
    );
    // now add in edited:
    Object.entries(edited).forEach(([id, item]) => {
      // $FlowFixMe
      if (!updated[id]) {
        myPublishedCollections[id] = item;
      } else {
        // $FlowFixMe
        myPublishedCollections[id] = { ...myPublishedCollections[id], updatedAt: item.updatedAt };
      }
    });
    return myPublishedCollections;
  }
);

export const selectMyPublishedOnlyCollections = createSelector(
  selectResolvedCollections,
  selectPendingCollections,
  selectMyCollectionIds,
  (resolved, pending, myIds) => {
    // all resolved in myIds, plus those in pending and edited
    const myPublishedCollections = fromEntries(
      Object.entries(pending).concat(
        Object.entries(resolved).filter(
          ([key, val]) =>
            myIds.includes(key) &&
            // $FlowFixMe
            !pending[key]
        )
      )
    );
    return myPublishedCollections;
  }
);

export const selectCollectionValuesListForKey = createSelector(
  (state, key) => key,
  selectBuiltinCollections,
  selectCurrentQueueList,
  selectMyPublishedCollections,
  selectMyUnpublishedCollections,
  (key, builtin, queue, published, unpublished) => {
    const myCollections = { builtin, queue, published, unpublished };
    const collectionsForKey = myCollections[key];
    // this is needed so Flow doesn't error saying it is mixed when this list is looped
    const collectionValues: CollectionList = (Object.values(collectionsForKey): any);

    return collectionValues;
  }
);

export const selectIsMyCollectionPublishedForId = (state: State, id: string) => {
  const publishedCollection = selectMyPublishedCollections(state);
  return Boolean(publishedCollection[id]);
};

export const selectPublishedCollectionNotEditedForId = createSelector(
  selectIsMyCollectionPublishedForId,
  selectCollectionHasEditsForId,
  (isPublished, hasEdits) => isPublished && !hasEdits
);

export const selectMyPublishedMixedCollections = createSelector(selectMyPublishedCollections, (published) => {
  const myCollections = fromEntries(
    // $FlowFixMe
    Object.entries(published).filter(([key, collection]) => {
      // $FlowFixMe
      return collection.type === COLLECTIONS_CONSTS.COL_TYPES.COLLECTION;
    })
  );
  return myCollections;
});

export const selectMyPublishedCollectionForId = (state: State, id: string) => {
  const myPublishedCollections = selectMyPublishedCollections(state);
  return myPublishedCollections[id];
};

export const selectMyPublishedOnlyCollectionForId = (state: State, id: string) => {
  const myPublishedCollections = selectMyPublishedOnlyCollections(state);
  return myPublishedCollections[id];
};

export const selectMyPublishedCollectionCountForId = (state: State, id: string) => {
  const publishedCollection = selectMyPublishedOnlyCollectionForId(state, id);
  const count = selectCountForCollection(publishedCollection);
  return count;
};

export const selectIsResolvingCollectionForId = (state: State, id: string) => {
  const resolvingById = selectIsResolvingCollectionById(state);
  return resolvingById[id];
};

export const selectCollectionForId = createSelector(
  (state, id) => id,
  selectBuiltinCollections,
  selectResolvedCollections,
  selectMyUnpublishedCollections,
  selectMyEditedCollections,
  selectPendingCollections,
  selectCurrentQueueList,
  (id, bLists, rLists, uLists, eLists, pLists, queue) => {
    const collection = bLists[id] || uLists[id] || eLists[id] || pLists[id] || rLists[id] || queue[id];
    return collection;
  }
);

export const selectIsCollectionBuiltInForId = (state: State, id: string) => {
  const builtin = selectBuiltinCollections(state);
  return builtin[id];
};

export const selectClaimSavedForUrl = (state: State, url: string) => {
  const [bLists, myRLists, uLists, eLists, pLists] = [
    selectBuiltinCollections(state),
    selectMyPublishedCollections(state),
    selectMyUnpublishedCollections(state),
    selectMyEditedCollections(state),
    selectPendingCollections(state),
  ];
  const collections = [bLists, uLists, eLists, myRLists, pLists];

  // $FlowFixMe
  return collections.some((list) => Object.values(list).some(({ items }) => items?.some((item) => item === url)));
};

export const selectClaimInCollectionsForUrl = (state: State, url: string) => {
  const queue = selectQueueCollection(state);
  const claimInQueue = queue.items.some((item) => item === url);
  const claimSaved = selectClaimSavedForUrl(state, url);

  return claimSaved && claimInQueue;
};

export const selectCollectionForIdHasClaimUrl = (state: State, id: string, uri: string) => {
  // $FlowFixMe
  const url = isPermanentUrl(uri) ? uri : selectPermanentUrlForUri(state, uri);
  const collection = selectCollectionForId(state, id);

  return collection && collection.items.includes(url);
};

export const selectUrlsForCollectionId = (state: State, id: string) => {
  const collection = selectCollectionForId(state, id);
  // -- sanitize -- > in case non-urls got added into a collection: only select string types
  // to avoid general app errors trying to use its uri
  return collection && collection.items.filter((item) => typeof item === 'string');
};

export const selectBrokenUrlsForCollectionId = (state: State, id: string) => {
  const collection = selectCollectionForId(state, id);
  // Allows removing non-standard uris from a collection
  return collection && collection.items.filter((item) => typeof item !== 'string');
};

export const selectFirstItemUrlForCollection = createSelector(
  selectUrlsForCollectionId,
  (collectionItemUrls) => collectionItemUrls?.length > 0 && collectionItemUrls[0]
);

export const selectCollectionLengthForId = (state: State, id: string) => {
  const urls = selectUrlsForCollectionId(state, id);
  return urls?.length || 0;
};

export const selectCollectionIsEmptyForId = (state: State, id: string) => {
  const length = selectCollectionLengthForId(state, id);
  return length === 0;
};

export const selectAreBuiltinCollectionsEmpty = (state: State) => {
  const notEmpty = COLLECTIONS_CONSTS.BUILTIN_PLAYLISTS.some((collectionKey) => {
    if (collectionKey !== COLLECTIONS_CONSTS.QUEUE_ID) {
      const length = selectCollectionLengthForId(state, collectionKey);
      return length > 0;
    }
  });

  return !notEmpty;
};

export const selectClaimIdsForCollectionId = createSelector(selectCollectionForId, (collection) => {
  const items = (collection && collection.items) || [];

  const ids = items.map((item) => {
    const { claimId } = parseURI(item);
    return claimId;
  });

  return ids;
});

export const selectIndexForUrlInCollection = createSelector(
  (state, url, id, ignoreShuffle) => ignoreShuffle,
  (state, url, id) => id,
  (state, url, id) => selectUrlsForCollectionId(state, id),
  (state, url) => url,
  (state) => selectPlayingCollection(state),
  selectClaimForUri,
  (ignoreShuffle, id, urls, url, playingCollection, claim) => {
    const { collectionId: playingCollectionId, shuffle } = playingCollection;

    const shuffleUrls = !ignoreShuffle && shuffle && playingCollectionId === id && shuffle.newUrls;
    const listUrls = shuffleUrls || urls;

    const index = listUrls && listUrls.findIndex((u) => u === url);
    if (index > -1) {
      return index;
    } else if (claim) {
      const index = listUrls && listUrls.findIndex((u) => u === claim.permanent_url);
      if (index > -1) return index;
    }
    return null;
  }
);

export const selectPreviousUrlForCollectionAndUrl = createCachedSelector(
  (state, url, id) => id,
  (state) => selectPlayingCollection(state),
  (state, url, id) => selectIndexForUrlInCollection(state, url, id),
  (state, url, id) => selectUrlsForCollectionId(state, id),
  (id, playingCollection, index, urls) => {
    const { collectionId: playingCollectionId, shuffle, loop } = playingCollection;

    const loopList = loop && playingCollectionId === id;
    const shuffleUrls = shuffle && playingCollectionId === id && shuffle.newUrls;
    const listUrls = shuffleUrls || urls;

    if (index > -1 && listUrls) {
      let nextUrl;
      if (index === 0 && loopList) {
        nextUrl = listUrls[listUrls.length - 1];
      } else {
        nextUrl = listUrls[index - 1];
      }
      return nextUrl || null;
    } else {
      return null;
    }
  }
)((state, url, id) => `${String(url)}:${String(id)}`);

export const selectNextUrlForCollectionAndUrl = createCachedSelector(
  (state, url, id) => id,
  (state) => selectPlayingCollection(state),
  (state, url, id) => selectIndexForUrlInCollection(state, url, id),
  (state, url, id) => selectUrlsForCollectionId(state, id),
  (id, playingCollection, index, urls) => {
    const { collectionId: playingCollectionId, shuffle, loop } = playingCollection;

    const loopList = loop && playingCollectionId === id;
    const shuffleUrls = shuffle && playingCollectionId === id && shuffle.newUrls;
    const listUrls = shuffleUrls || urls;

    if (index > -1 && listUrls) {
      // We'll get the next playble url
      let remainingUrls = listUrls.slice(index + 1);
      if (!remainingUrls.length && loopList) {
        remainingUrls = listUrls.slice(0);
      }
      const nextUrl = remainingUrls && remainingUrls[0];
      return nextUrl || null;
    } else {
      return null;
    }
  }
)((state, url, id) => `${String(url)}:${String(id)}`);

export const selectNameForCollectionId = createSelector(
  selectCollectionForId,
  (collection) => (collection && collection.name) || ''
);

export const selectThumbnailForCollectionId = (state: State, id: string) => {
  const collection = selectCollectionForId(state, id);
  return collection && collection.thumbnail?.url;
};

export const selectUpdatedAtForCollectionId = createSelector(
  selectCollectionForId,
  selectUserCreationDate,
  selectUpdatedCollectionForId,
  (collection, userCreatedAt, updated) => {
    const collectionUpdatedAt = (updated?.updatedAt || collection?.updatedAt || 0) * 1000;

    const userCreationDate = moment(userCreatedAt).format('MMMM DD YYYY');
    const collectionUpdatedDate = moment(collectionUpdatedAt).format('MMMM DD YYYY');

    // Collection updated time can't be older than account creation date
    if (moment(collectionUpdatedDate).diff(moment(userCreationDate)) < 0) {
      return userCreatedAt;
    }

    return collectionUpdatedAt || '';
  }
);

export const selectCreatedAtForCollectionId = (state: State, id: string) => {
  const collection = selectCollectionForId(state, id);
  const isBuiltin = COLLECTIONS_CONSTS.BUILTIN_PLAYLISTS.includes(id);

  if (isBuiltin) {
    const userCreatedAt = selectUserCreationDate(state);
    return userCreatedAt;
  }

  if (collection?.createdAt) return collection.createdAt * 1000;

  const publishedClaim = selectPublishedCollectionClaimForId(state, id);
  if (publishedClaim) return publishedClaim.meta?.creation_timestamp * 1000;

  return null;
};

export const selectCountForCollectionId = createSelector(selectCollectionForId, (collection) =>
  selectCountForCollection(collection)
);

export const selectIsCollectionPrivateForId = createSelector(
  (state, id) => id,
  selectBuiltinCollections,
  selectMyUnpublishedCollections,
  selectCurrentQueueList,
  (id, builtinById, unpublishedById, queue) => Boolean(builtinById[id] || unpublishedById[id] || queue[id])
);

export const selectFeaturedChannelsByChannelId = createSelector(
  selectMyUnpublishedCollections,
  selectResolvedCollections,
  selectClaimsById,
  (privateLists, publicLists, claimsById) => {
    let results: { [ChannelId]: Array<CollectionId> } = {};

    function addToResults(channelId, collectionId) {
      if (results[channelId]) {
        const ids = results[channelId];
        // $FlowIgnore
        if (!ids.some((id) => id === collectionId)) {
          ids.push(collectionId);
        }
      } else {
        results[channelId] = [collectionId];
      }
    }

    Object.values(privateLists).forEach((col) => {
      // $FlowIgnore
      const { type, featuredChannelsParams, id } = col;
      if (type === COL_TYPES.FEATURED_CHANNELS && featuredChannelsParams?.channelId) {
        addToResults(featuredChannelsParams.channelId, id);
      }
    });

    Object.values(publicLists).forEach((col) => {
      // $FlowIgnore
      const { type, id } = col;
      if (type === COL_TYPES.FEATURED_CHANNELS) {
        const channelId = getChannelIdFromClaim(claimsById[id]);
        if (channelId) {
          addToResults(channelId, id);
        }
      }
    });

    return results;
  }
);

function flatten(ary, ret = []) {
  // Array.flat() support not available in obscure browsers.
  for (const entry of ary) {
    if (Array.isArray(entry)) {
      flatten(entry, ret);
    } else {
      ret.push(entry);
    }
  }
  return ret;
}

export const selectFeaturedChannelsIds = createSelector(selectFeaturedChannelsByChannelId, (byChannelId) => {
  // $FlowIgnore mixed
  const values: Array<Array<CollectionId>> = Object.values(byChannelId);
  return flatten(values);
});

export const selectCollectionTypeForId = (state: State, id: string) => {
  const collection = selectCollectionForId(state, id);
  return collection?.type;
};
