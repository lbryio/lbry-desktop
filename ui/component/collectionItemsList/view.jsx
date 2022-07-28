// @flow
import React from 'react';
import ClaimList from 'component/claimList';
import Spinner from 'component/spinner';

// prettier-ignore
const Lazy = {
  // $FlowFixMe
  DragDropContext: React.lazy(() => import('react-beautiful-dnd' /* webpackChunkName: "dnd" */).then((module) => ({ default: module.DragDropContext }))),
  // $FlowFixMe
  Droppable: React.lazy(() => import('react-beautiful-dnd' /* webpackChunkName: "dnd" */).then((module) => ({ default: module.Droppable }))),
};

type Props = {
  collectionId: string,
  // -- redux --
  collection: Collection,
  isPrivateCollection: boolean,
  isEditedCollection: boolean,
  isResolvingCollection: boolean,
  collectionUrls: Array<string>,
  doCollectionEdit: (id: string, params: CollectionEditParams) => void,
  doFetchItemsInCollection: (options: { collectionId: string, pageSize?: number }) => void,
};

const CollectionItemsList = (props: Props) => {
  const {
    collectionId,
    collection,
    isPrivateCollection,
    isEditedCollection,
    collectionUrls,
    isResolvingCollection,
    doCollectionEdit,
    doFetchItemsInCollection,
    ...claimListProps
  } = props;

  const { totalItems } = collection || {};

  const urlsReady = collectionUrls && (totalItems === undefined || totalItems === collectionUrls.length);
  const shouldFetchItems = isPrivateCollection || isEditedCollection || (!urlsReady && collectionId && !collection);

  function handleOnDragEnd(result: any) {
    const { source, destination } = result;

    if (!destination) return;

    const { index: from } = source;
    const { index: to } = destination;

    doCollectionEdit(collectionId, { order: { from, to } });
  }
  React.useEffect(() => {
    if (shouldFetchItems) {
      doFetchItemsInCollection({ collectionId });
    }
  }, [collectionId, doFetchItemsInCollection, shouldFetchItems]);

  return (
    <React.Suspense fallback={null}>
      {isResolvingCollection ? (
        <div className="main--empty">
          <Spinner />
        </div>
      ) : (
        <Lazy.DragDropContext onDragEnd={handleOnDragEnd}>
          <Lazy.Droppable droppableId="list__ordering">
            {(DroppableProvided) => (
              <ClaimList
                collectionId={collectionId}
                uris={collectionUrls}
                droppableProvided={DroppableProvided}
                {...claimListProps}
              />
            )}
          </Lazy.Droppable>
        </Lazy.DragDropContext>
      )}
    </React.Suspense>
  );
};

export default CollectionItemsList;
