// @flow
import React from 'react';
import { useHistory } from 'react-router';
import { EDIT_PAGE, PAGE_VIEW_QUERY } from 'page/collection/view';
import Card from 'component/common/card';
import CollectionActions from '../collectionActions';
import ClaimDescription from 'component/claimDescription';
import Icon from 'component/common/icon';
import Button from 'component/button';
import ClaimAuthor from 'component/claimAuthor';
import * as COLLECTIONS_CONSTS from 'constants/collections';
import * as ICONS from 'constants/icons';
import Spinner from 'component/spinner';
import CollectionPrivateIcon from 'component/common/collection-private-icon';

type Props = {
  collectionId: string,
  showEdit: boolean,
  unavailableUris: Array<string>,
  setShowEdit: (show: boolean) => void,
  setUnavailable: (uris: Array<string>) => void,
  // -- redux --
  uri: string,
  collection: Collection,
  collectionCount: number,
  claimIsPending: boolean,
  collectionHasEdits: boolean,
  publishedCollectionCount: ?number,
  isMyCollection: boolean,
  doCollectionEdit: (collectionId: string, params: CollectionEditParams) => void,
};

const CollectionHeader = (props: Props) => {
  const {
    collectionId,
    showEdit,
    unavailableUris,
    setShowEdit,
    setUnavailable,
    // -- redux --
    uri,
    collection,
    collectionCount,
    claimIsPending,
    collectionHasEdits,
    publishedCollectionCount,
    isMyCollection,
    doCollectionEdit,
  } = props;

  const { push } = useHistory();
  const isBuiltin = COLLECTIONS_CONSTS.BUILTIN_PLAYLISTS.includes(collectionId);
  const listName = collection?.name;

  return (
    <Card
      title={
        <span>
          <Icon
            icon={COLLECTIONS_CONSTS.PLAYLIST_ICONS[collectionId] || ICONS.PLAYLIST}
            className="icon--margin-right"
          />
          {isBuiltin ? __(listName) : listName}
          {collectionHasEdits ? __(' (Published playlist with pending changes)') : undefined}
        </span>
      }
      titleActions={
        unavailableUris.length > 0 ? (
          <Button
            button="close"
            icon={ICONS.DELETE}
            label={__('Remove all unavailable claims')}
            onClick={() => {
              doCollectionEdit(collectionId, { uris: unavailableUris, remove: true });
              setUnavailable([]);
            }}
          />
        ) : claimIsPending ? (
          <div className="help card__title--help">
            <Spinner type="small" />
            {__('Your publish is being confirmed and will be live soon')}
          </div>
        ) : (
          isMyCollection &&
          !isBuiltin && (
            <Button
              button="close"
              title={__('Edit')}
              className="button-toggle"
              icon={ICONS.EDIT}
              onClick={() => push(`?${PAGE_VIEW_QUERY}=${EDIT_PAGE}`)}
            />
          )
        )
      }
      subtitle={
        <div>
          <span className="collection__subtitle">
            {collectionHasEdits
              ? __('Published count: %published_count%, edited count: %edited_count%', {
                  published_count: publishedCollectionCount,
                  edited_count: collectionCount,
                })
              : collectionCount === 1
              ? __('1 item')
              : __('%collectionCount% items', { collectionCount })}
          </span>

          <ClaimDescription uri={uri} description={collection?.description} />

          {uri ? <ClaimAuthor uri={uri} /> : <CollectionPrivateIcon />}
        </div>
      }
      body={
        <CollectionActions
          uri={uri}
          collectionId={collectionId}
          isBuiltin={isBuiltin}
          setShowEdit={setShowEdit}
          showEdit={showEdit}
        />
      }
    />
  );
};

export default CollectionHeader;
