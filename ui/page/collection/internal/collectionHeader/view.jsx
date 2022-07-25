// @flow
import React from 'react';
import { useHistory } from 'react-router';
import { EDIT_PAGE, PAGE_VIEW_QUERY } from 'page/collection/view';
import Card from 'component/common/card';
import CollectionActions from '../collectionActions';
import Button from 'component/button';
import * as COLLECTIONS_CONSTS from 'constants/collections';
import * as ICONS from 'constants/icons';
import Spinner from 'component/spinner';
import CollectionTitle from './internal/collectionTitle';
import CollectionSubtitle from './internal/collectionSubtitle';

type Props = {
  collectionId: string,
  showEdit: boolean,
  unavailableUris: Array<string>,
  setShowEdit: (show: boolean) => void,
  setUnavailable: (uris: Array<string>) => void,
  // -- redux --
  uri: string,
  claimIsPending: boolean,
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
    claimIsPending,
    isMyCollection,
    doCollectionEdit,
  } = props;

  const { push } = useHistory();
  const isBuiltin = COLLECTIONS_CONSTS.BUILTIN_PLAYLISTS.includes(collectionId);

  return (
    <Card
      title={<CollectionTitle collectionId={collectionId} />}
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
      subtitle={<CollectionSubtitle collectionId={collectionId} />}
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
