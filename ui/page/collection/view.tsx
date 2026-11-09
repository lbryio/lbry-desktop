import {DragDropContext, Droppable} from 'react-beautiful-dnd';

import React from 'react';
import ClaimList from 'component/claimList';
import Page from 'component/page';
import * as PAGES from 'constants/pages';
import { useHistory } from 'react-router-dom';
import CollectionEdit from 'component/collectionEdit';
import Card from 'component/common/card';
import Button from 'component/button';
import CollectionActions from 'component/collectionActions';
import classnames from 'classnames';
import ClaimAuthor from 'component/claimAuthor';
import FileDescription from 'component/fileDescription';
import * as COLLECTIONS_CONSTS from 'constants/collections';
import Icon from 'component/common/icon';
import * as ICONS from 'constants/icons';
import Spinner from 'component/spinner';
import { FormField } from 'component/common/form';

export const PAGE_VIEW_QUERY = 'view';
export const EDIT_PAGE = 'edit';

type Props = {
  collectionId: string,
  uri: string,
  claim: Claim,
  title: string,
  thumbnail: string,
  collection: Collection,
  collectionUrls: Array<string>,
  collectionCount: number,
  isResolvingCollection: boolean,
  isMyClaim: boolean,
  isMyCollection: boolean,
  claimIsPending: boolean,
  collectionHasEdits: boolean,
  deleteCollection: (arg1: string, arg2: string) => void,
  editCollection: (arg1: string, arg2: CollectionEditParams) => void,
  fetchCollectionItems: (arg1: string, arg2: () => void) => void,
  resolveUris: (arg1: string) => void,
  user: User | null | undefined,
  renameCollection: (arg1: string, arg2: string) => void
};

export default function CollectionPage(props: Props) {
  const {
    collectionId,
    uri,
    claim,
    collection,
    collectionUrls,
    collectionCount,
    collectionHasEdits,
    claimIsPending,
    isResolvingCollection,
    editCollection,
    fetchCollectionItems,
    deleteCollection,
    renameCollection,
  } = props;

  const {
    replace,
    location: { search },
  } = useHistory();

  const [didTryResolve, setDidTryResolve] = React.useState(false);
  const [showInfo, setShowInfo] = React.useState(false);
  const [showEdit, setShowEdit] = React.useState(false);
  const [unavailableUris, setUnavailable] = React.useState([]);

  const collectionName = claim ? claim.value.title || claim.name : collection && collection.name;

  const [isRenamingList, setIsRenamingList] = React.useState(false);
  const [newName, setNewName] = React.useState(collectionName);

  const { name, totalItems } = collection || {};
// @ts-expect-error - TS2345 - Argument of type 'string' is not assignable to parameter of type '"watchlater" | "favorites" | "favoriteChannels"'.
  const isBuiltin = COLLECTIONS_CONSTS.BUILTIN_LISTS.includes(collectionId);

  function handleOnDragEnd(result: unknown) {
// @ts-expect-error - TS2339 - Property 'source' does not exist on type '{}'. | TS2339 - Property 'destination' does not exist on type '{}'.
    const { source, destination } = result;

    if (!destination) return;

    const { index: from } = source;
    const { index: to } = destination;

    editCollection(collectionId, { order: { from, to } });
  }

  function handleRenameCollection() {
    renameCollection(collectionId, newName);
    setIsRenamingList(false);
  }

  const urlParams = new URLSearchParams(search);
  const editing = urlParams.get(PAGE_VIEW_QUERY) === EDIT_PAGE;

  const urlsReady =
    collectionUrls && (totalItems === undefined || (totalItems && totalItems === collectionUrls.length));

  React.useEffect(() => {
    if (collectionId && !urlsReady && !didTryResolve && !collection) {
      fetchCollectionItems(collectionId, () => setDidTryResolve(true));
    }
  }, [collectionId, urlsReady, didTryResolve, setDidTryResolve, fetchCollectionItems, collection]);

  const pending = (
    <div className="help card__title--help">
      {/* @ts-expect-error - TS2322 (ts-migration) */}
      <Spinner type={'small'} />
      {__('Your publish is being confirmed and will be live soon')}
    </div>
  );

  const unpublished = (
    <Button
      // @ts-expect-error - TS2322 (ts-migration)
      button="close"
      icon={ICONS.REFRESH}
      label={__('Clear Edits')}
      onClick={() => deleteCollection(collectionId, COLLECTIONS_CONSTS.COL_KEY_EDITED)}
    />
  );

  const removeUnavailable = (
    <Button
      // @ts-expect-error - TS2322 (ts-migration)
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

  const subTitle = (
    <div>
      <span className="collection__subtitle">
        {collectionCount === 1 ? __('1 item') : __('%collectionCount% items', { collectionCount })}
      </span>
      {/* @ts-expect-error - TS2322 (ts-migration) */}
      {uri && <ClaimAuthor uri={uri} />}
    </div>
  );
  const info = (
    <Card
      title={
        isRenamingList ? (
          <FormField
            autoFocus
            type="text"
// @ts-expect-error - TS2322 - Type '{ autoFocus: true; type: string; className: string; name: string; value: string; inputButton: Element; onChange: (e: any) => void; }' is not assignable to type 'IntrinsicAttributes & IntrinsicClassAttributes<FormField> & Pick<Readonly<Props> & Readonly<{ children?: ReactNode; }>, "error" | ... 22 more ... | "onChange"> & InexactPartial<...> & InexactPartial<...>'.
            className={'editable-text__field'}
            name="rename_collection"
            value={newName}
            inputButton={
              <>
                <Button
                  // @ts-expect-error - TS2322 (ts-migration)
                  icon={ICONS.COMPLETE}
                  disabled={!(newName || '').trim() || collectionName === newName}
                  onClick={handleRenameCollection}
                  className={'editable-text__input-button'}
                />
                <Button
                  // @ts-expect-error - TS2322 (ts-migration)
                  icon={ICONS.REMOVE}
                  onClick={() => {
                    setIsRenamingList(false);
                    setNewName(collectionName);
                  }}
                  className={'editable-text__input-button'}
                />
              </>
            }
            onChange={(e) => setNewName(e.target.value)}
          />
        ) : (
          <span>
            <Icon
              icon={
                (collectionId === COLLECTIONS_CONSTS.WATCH_LATER_ID && ICONS.TIME) ||
                (collectionId === COLLECTIONS_CONSTS.FAVORITES_ID && ICONS.STAR) ||
                ICONS.STACK
              }
              className="icon--margin-right"
            />
            {collectionName}
            {!uri && (
              <>
                <Button
                  // @ts-expect-error - TS2322 (ts-migration)
                  className={'editable-text__input-button'}
                  icon={ICONS.EDIT}
                  onClick={() => setIsRenamingList(true)}
                />
              </>
            )}
          </span>
        )
      }
      titleActions={unavailableUris.length > 0 ? removeUnavailable : titleActions}
      subtitle={subTitle}
      body={
        <CollectionActions
          uri={uri}
          collectionId={collectionId}
          setShowInfo={setShowInfo}
          showInfo={showInfo}
          isBuiltin={isBuiltin}
          // @ts-expect-error - TS2322 (ts-migration)
          collectionUrls={collectionUrls}
          setShowEdit={setShowEdit}
          showEdit={showEdit}
        />
      }
      actions={
        showInfo &&
        uri && (
          <div className="section">
            <FileDescription uri={uri} expandOverride />
          </div>
        )
      }
    />
  );

  if (!collection && (isResolvingCollection || !didTryResolve)) {
    return (
      // @ts-expect-error - TS2740 (ts-migration)
      <Page>
        <h2 className="main--empty empty">{__('Loading...')}</h2>
      </Page>
    );
  }

  if (!collection && !isResolvingCollection && didTryResolve) {
    return (
      // @ts-expect-error - TS2740 (ts-migration)
      <Page>
        <h2 className="main--empty empty">{__('Nothing here')}</h2>
      </Page>
    );
  }

  if (editing) {
    return (
      <Page
        // @ts-expect-error - TS2322 (ts-migration)
        noFooter
        noSideNavigation={editing}
        backout={{
          title: __('%action% %collection%', { collection: name, action: uri ? __('Editing') : __('Publishing') }),
          simpleTitle: uri ? __('Editing') : __('Publishing'),
        }}
      >
        {/* @ts-expect-error - TS2322, TS2741 (ts-migration) */}
        <CollectionEdit
          uri={uri}
          collectionId={collectionId}
          onDone={(id) => {
            replace(`/$/${PAGES.LIST}/${id}`);
          }}
        />
      </Page>
    );
  }

  if (urlsReady) {
    return (
      // @ts-expect-error - TS2740 (ts-migration)
      <Page className="playlistPage-wrapper">
        {editing}
        <div className={classnames('section card-stack')}>
          {info}

          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="list__ordering">
              {(DroppableProvided) => (
                // @ts-expect-error - TS2740 (ts-migration)
                <ClaimList
                  uris={collectionUrls}
                  collectionId={collectionId}
                  showEdit={showEdit}
                  droppableProvided={DroppableProvided}
                  unavailableUris={unavailableUris}
                />
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </Page>
    );
  }
}
