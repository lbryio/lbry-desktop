// @flow
import fromEntries from '@ungap/from-entries';
import { createSelector } from 'reselect';
import { selectMyCollectionIds, makeSelectClaimForUri } from 'redux/selectors/claims';
import { parseURI } from 'util/lbryURI';

type State = { collections: CollectionState };

const selectState = (state: State) => state.collections;

export const selectSavedCollectionIds = (state: State) => selectState(state).saved;
export const selectBuiltinCollections = (state: State) => selectState(state).builtin;
export const selectResolvedCollections = (state: State) => selectState(state).resolved;
export const selectMyUnpublishedCollections = (state: State) => selectState(state).unpublished;
export const selectMyEditedCollections = (state: State) => selectState(state).edited;
export const selectPendingCollections = (state: State) => selectState(state).pending;

export const selectLastUsedCollection = createSelector(selectState, (state) => state.lastUsedCollection);

export const makeSelectEditedCollectionForId = (id: string) =>
  createSelector(selectMyEditedCollections, (eLists) => eLists[id]);

export const makeSelectPendingCollectionForId = (id: string) =>
  createSelector(selectPendingCollections, (pending) => pending[id]);

export const makeSelectPublishedCollectionForId = (id: string) =>
  createSelector(selectResolvedCollections, (rLists) => rLists[id]);

export const makeSelectUnpublishedCollectionForId = (id: string) =>
  createSelector(selectMyUnpublishedCollections, (rLists) => rLists[id]);

export const makeSelectCollectionIsMine = (id: string) =>
  createSelector(
    selectMyCollectionIds,
    selectMyUnpublishedCollections,
    selectBuiltinCollections,
    (publicIds, privateIds, builtinIds) => {
      return Boolean(publicIds.includes(id) || privateIds[id] || builtinIds[id]);
    }
  );

export const selectMyPublishedCollections = createSelector(
  selectResolvedCollections,
  selectPendingCollections,
  selectMyEditedCollections,
  selectMyCollectionIds,
  (resolved, pending, edited, myIds) => {
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
      myPublishedCollections[id] = item;
    });
    return myPublishedCollections;
  }
);

export const selectMyPublishedMixedCollections = createSelector(selectMyPublishedCollections, (published) => {
  const myCollections = fromEntries(
    // $FlowFixMe
    Object.entries(published).filter(([key, collection]) => {
      // $FlowFixMe
      return collection.type === 'collection';
    })
  );
  return myCollections;
});

export const selectMyPublishedPlaylistCollections = createSelector(selectMyPublishedCollections, (published) => {
  const myCollections = fromEntries(
    // $FlowFixMe
    Object.entries(published).filter(([key, collection]) => {
      // $FlowFixMe
      return collection.type === 'playlist';
    })
  );
  return myCollections;
});

export const makeSelectMyPublishedCollectionForId = (id: string) =>
  createSelector(selectMyPublishedCollections, (myPublishedCollections) => myPublishedCollections[id]);

// export const selectSavedCollections = createSelector(
//   selectResolvedCollections,
//   selectSavedCollectionIds,
//   (resolved, myIds) => {
//     const mySavedCollections = fromEntries(
//       Object.entries(resolved).filter(([key, val]) => myIds.includes(key))
//     );
//     return mySavedCollections;
//   }
// );

export const makeSelectIsResolvingCollectionForId = (id: string) =>
  createSelector(selectState, (state) => {
    return state.isResolvingCollectionById[id];
  });

export const makeSelectCollectionForId = (id: string) =>
  createSelector(
    selectBuiltinCollections,
    selectResolvedCollections,
    selectMyUnpublishedCollections,
    selectMyEditedCollections,
    selectPendingCollections,
    (bLists, rLists, uLists, eLists, pLists) => {
      const collection = bLists[id] || uLists[id] || eLists[id] || pLists[id] || rLists[id];
      return collection;
    }
  );

export const makeSelectClaimUrlInCollection = (url: string) =>
  createSelector(
    selectBuiltinCollections,
    selectMyPublishedCollections,
    selectMyUnpublishedCollections,
    selectMyEditedCollections,
    selectPendingCollections,
    (bLists, myRLists, uLists, eLists, pLists) => {
      const collections = [bLists, uLists, eLists, myRLists, pLists];
      const itemsInCollections = [];
      collections.map((list) => {
        Object.entries(list).forEach(([key, value]) => {
          // $FlowFixMe
          value.items.map((item) => {
            itemsInCollections.push(item);
          });
        });
      });
      return itemsInCollections.includes(url);
    }
  );

export const makeSelectCollectionForIdHasClaimUrl = (id: string, url: string) =>
  createSelector(makeSelectCollectionForId(id), (collection) => collection && collection.items.includes(url));

export const makeSelectUrlsForCollectionId = (id: string) =>
  createSelector(makeSelectCollectionForId(id), (collection) => collection && collection.items);

export const makeSelectClaimIdsForCollectionId = (id: string) =>
  createSelector(makeSelectCollectionForId(id), (collection) => {
    const items = (collection && collection.items) || [];
    const ids = items.map((item) => {
      const { claimId } = parseURI(item);
      return claimId;
    });
    return ids;
  });

export const makeSelectIndexForUrlInCollection = (url: string, id: string, ignoreShuffle?: boolean) =>
  createSelector(
    (state) => state.content.shuffleList,
    makeSelectUrlsForCollectionId(id),
    makeSelectClaimForUri(url),
    (shuffleState, urls, claim) => {
      const shuffleUrls = !ignoreShuffle && shuffleState && shuffleState.collectionId === id && shuffleState.newUrls;
      const listUrls = shuffleUrls || urls;

      const index = listUrls && listUrls.findIndex((u) => u === url);
      if (index > -1) {
        return index;
      } else if (claim) {
        const index = listUrls && listUrls.findIndex((u) => u === claim.permanent_url);
        if (index > -1) return index;
        return claim;
      }
      return null;
    }
  );

export const makeSelectPreviousUrlForCollectionAndUrl = (id: string, url: string) =>
  createSelector(
    (state) => state.content.shuffleList,
    (state) => state.content.loopList,
    makeSelectIndexForUrlInCollection(url, id),
    makeSelectUrlsForCollectionId(id),
    (shuffleState, loopState, index, urls) => {
      const loopList = loopState && loopState.collectionId === id && loopState.loop;
      const shuffleUrls = shuffleState && shuffleState.collectionId === id && shuffleState.newUrls;

      if (index > -1) {
        const listUrls = shuffleUrls || urls;
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
  );

export const makeSelectNextUrlForCollectionAndUrl = (id: string, url: string) =>
  createSelector(
    (state) => state.content.shuffleList,
    (state) => state.content.loopList,
    makeSelectIndexForUrlInCollection(url, id),
    makeSelectUrlsForCollectionId(id),
    (shuffleState, loopState, index, urls) => {
      const loopList = loopState && loopState.collectionId === id && loopState.loop;
      const shuffleUrls = shuffleState && shuffleState.collectionId === id && shuffleState.newUrls;

      if (index > -1) {
        const listUrls = shuffleUrls || urls;
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
  );

export const makeSelectNameForCollectionId = (id: string) =>
  createSelector(makeSelectCollectionForId(id), (collection) => {
    return (collection && collection.name) || '';
  });

export const makeSelectCountForCollectionId = (id: string) =>
  createSelector(makeSelectCollectionForId(id), (collection) => {
    if (collection) {
      if (collection.itemCount !== undefined) {
        return collection.itemCount;
      }
      let itemCount = 0;
      collection.items.map((item) => {
        if (item) {
          itemCount += 1;
        }
      });
      return itemCount;
    }
    return null;
  });
