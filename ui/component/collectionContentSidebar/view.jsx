// @flow
import React from 'react';
import classnames from 'classnames';
import ClaimList from 'component/claimList';
import Card from 'component/common/card';
import Button from 'component/button';
import * as PAGES from 'constants/pages';
import * as COLLECTIONS_CONSTS from 'constants/collections';
import Icon from 'component/common/icon';
import * as ICONS from 'constants/icons';

// prettier-ignore
const Lazy = {
  // $FlowFixMe
  DragDropContext: React.lazy(() => import('react-beautiful-dnd' /* webpackChunkName: "dnd" */).then((module) => ({ default: module.DragDropContext }))),
  // $FlowFixMe
  Droppable: React.lazy(() => import('react-beautiful-dnd' /* webpackChunkName: "dnd" */).then((module) => ({ default: module.Droppable }))),
};

type Props = {
  id: string,
  url: string,
  isMyCollection: boolean,
  collectionUrls: Array<Claim>,
  collectionName: string,
  collection: any,
  loop: boolean,
  shuffle: boolean,
  doToggleLoopList: (string, boolean) => void,
  doToggleShuffleList: (string, string, boolean) => void,
  createUnpublishedCollection: (string, Array<any>, ?string) => void,
  doCollectionEdit: (string, CollectionEditParams) => void,
};

export default function CollectionContent(props: Props) {
  const {
    isMyCollection,
    collectionUrls,
    collectionName,
    id,
    url,
    loop,
    shuffle,
    doToggleLoopList,
    doToggleShuffleList,
    doCollectionEdit,
  } = props;

  const [showEdit, setShowEdit] = React.useState(false);

  function handleOnDragEnd(result) {
    const { source, destination } = result;

    if (!destination) return;

    const { index: from } = source;
    const { index: to } = destination;

    doCollectionEdit(id, { order: { from, to } });
  }

  return (
    <Card
      isBodyList
      className="file-page__playlist-collection"
      title={
        <>
          <a href={`/$/${PAGES.LIST}/${id}`}>
            <span className="file-page__playlist-collection__row">
              <Icon
                icon={
                  (id === COLLECTIONS_CONSTS.WATCH_LATER_ID && ICONS.TIME) ||
                  (id === COLLECTIONS_CONSTS.FAVORITES_ID && ICONS.STAR) ||
                  ICONS.STACK
                }
                className="icon--margin-right"
              />
              {collectionName}
            </span>
          </a>
          <span className="file-page__playlist-collection__row">
            <Button
              button="alt"
              title={__('Loop')}
              icon={ICONS.REPEAT}
              iconColor={loop && 'blue'}
              className="button--file-action"
              onClick={() => doToggleLoopList(id, !loop)}
            />
            <Button
              button="alt"
              title={__('Shuffle')}
              icon={ICONS.SHUFFLE}
              iconColor={shuffle && 'blue'}
              className="button--file-action"
              onClick={() => doToggleShuffleList(url, id, !shuffle)}
            />
          </span>
        </>
      }
      titleActions={
        isMyCollection && (
          <Button
            title={__('Edit')}
            className={classnames('button-toggle', { 'button-toggle--active': showEdit })}
            icon={ICONS.EDIT}
            onClick={() => setShowEdit(!showEdit)}
          />
        )
      }
      body={
        <React.Suspense fallback={null}>
          <Lazy.DragDropContext onDragEnd={handleOnDragEnd}>
            <Lazy.Droppable droppableId="list__ordering">
              {(DroppableProvided) => (
                <ClaimList
                  isCardBody
                  type="small"
                  activeUri={url}
                  uris={collectionUrls}
                  collectionId={id}
                  empty={__('List is Empty')}
                  showEdit={showEdit}
                  droppableProvided={DroppableProvided}
                />
              )}
            </Lazy.Droppable>
          </Lazy.DragDropContext>
        </React.Suspense>
      }
    />
  );
}
