// @flow
import React from 'react';
import ClaimList from 'component/claimList';
import Page from 'component/page';
import { useHistory } from 'react-router-dom';
import Card from 'component/common/card';
import Button from 'component/button';
import classnames from 'classnames';
import * as COLLECTIONS_CONSTS from 'constants/collections';
import Icon from 'component/common/icon';
import * as ICONS from 'constants/icons';
import Spinner from 'component/spinner';

import usePersistedState from 'effects/use-persisted-state';

// prettier-ignore
const Lazy = {
  // $FlowFixMe
  DragDropContext: React.lazy(() => import('react-beautiful-dnd' /* webpackChunkName: "dnd" */).then((module) => ({ default: module.DragDropContext }))),
  // $FlowFixMe
  Droppable: React.lazy(() => import('react-beautiful-dnd' /* webpackChunkName: "dnd" */).then((module) => ({ default: module.Droppable }))),
};

export const PAGE_VIEW_QUERY = 'view';
export const EDIT_PAGE = 'edit';

type Props = {
  collectionId: string,
  claim: Claim,
  title: string,
  thumbnail: string,
  collectionUrls: Array<string>,
  isResolvingCollection: boolean,
  isMyClaim: boolean,
  isMyCollection: boolean,
  claimIsPending: boolean,
  collectionHasEdits: boolean,
  deleteCollection: (string, string) => void,
  editCollection: (string, CollectionEditParams) => void,
  fetchCollectionItems: (string, () => void) => void,
  resolveUris: (string) => void,
  user: ?User,
};

export default function HistoryPage(props: Props) {
  const {
    collectionId,
    claim,
    collectionHasEdits,
    claimIsPending,
    isResolvingCollection,
    editCollection,
    fetchCollectionItems,
    deleteCollection,
  } = props;

  const collection = {
    id: 'watchhistory',
    name: __('Watch History'),
    type: 'playlist',
  };
  const collectionUrls = [];

  const [history] = usePersistedState('watch-history', []);

  const {
    location: { search },
  } = useHistory();

  const [didTryResolve, setDidTryResolve] = React.useState(false);
  const [unavailableUris, setUnavailable] = React.useState([]);
  const isBuiltin = COLLECTIONS_CONSTS.BUILTIN_LISTS.includes(collectionId);

  function handleOnDragEnd(result) {
    const { source, destination } = result;

    if (!destination) return;

    const { index: from } = source;
    const { index: to } = destination;

    editCollection(collectionId, { order: { from, to } });
  }

  const urlParams = new URLSearchParams(search);
  const editing = urlParams.get(PAGE_VIEW_QUERY) === EDIT_PAGE;

  const urlsReady = collectionUrls && history.length;

  React.useEffect(() => {
    if (collectionId && !urlsReady && !didTryResolve && !collection) {
      fetchCollectionItems(collectionId, () => setDidTryResolve(true));
    }
  }, [collectionId, urlsReady, didTryResolve, setDidTryResolve, fetchCollectionItems, collection]);

  const pending = (
    <div className="help card__title--help">
      <Spinner type={'small'} />
      {__('Your publish is being confirmed and will be live soon')}
    </div>
  );

  const unpublished = (
    <Button
      button="close"
      icon={ICONS.REFRESH}
      label={__('Clear Edits')}
      onClick={() => deleteCollection(collectionId, COLLECTIONS_CONSTS.COL_KEY_EDITED)}
    />
  );

  const removeUnavailable = (
    <Button
      button="close"
      icon={ICONS.DELETE}
      label={__('Remove all unavailable claims')}
      onClick={() => {
        editCollection(collectionId, { uris: unavailableUris, remove: true });
        setUnavailable([]);
      }}
    />
  );

  let titleActions;
  if (collectionHasEdits) {
    titleActions = unpublished;
  } else if (claimIsPending) {
    titleActions = pending;
  }

  const listName = claim ? claim.value.title || claim.name : collection && collection.name;

  const info = (
    <Card
      title={
        <span>
          <Icon
            icon={
              (collectionId === COLLECTIONS_CONSTS.WATCH_LATER_ID && ICONS.TIME) ||
              (collectionId === COLLECTIONS_CONSTS.FAVORITES_ID && ICONS.STAR) ||
              ICONS.TIME
            }
            className="icon--margin-right"
          />
          {isBuiltin ? __(listName) : listName}
        </span>
      }
      titleActions={unavailableUris.length > 0 ? removeUnavailable : titleActions}
    />
  );

  if (!collection && (isResolvingCollection || !didTryResolve)) {
    return (
      <Page>
        <h2 className="main--empty empty">{__('Loading...')}</h2>
      </Page>
    );
  }

  if (!collection && !isResolvingCollection && didTryResolve) {
    return (
      <Page>
        <h2 className="main--empty empty">{__('Nothing here')}</h2>
      </Page>
    );
  }

  if (urlsReady) {
    return (
      <Page className="playlistPage-wrapper">
        {editing}
        <div className={classnames('section card-stack')}>
          {info}
          <React.Suspense fallback={null}>
            <Lazy.DragDropContext onDragEnd={handleOnDragEnd}>
              <Lazy.Droppable droppableId="list__ordering">
                {(DroppableProvided) => (
                  <ClaimList
                    uris={history}
                    collectionId={collectionId}
                    // showEdit={showEdit}
                    droppableProvided={DroppableProvided}
                    unavailableUris={unavailableUris}
                  />
                )}
              </Lazy.Droppable>
            </Lazy.DragDropContext>
          </React.Suspense>
        </div>
      </Page>
    );
  }
}
