// @flow
import React from 'react';
import CollectionPreviewTile from 'component/collectionPreviewTile';
import ClaimList from 'component/claimList';
import Button from 'component/button';
import { COLLECTIONS_CONSTS } from 'lbry-redux';
import * as PAGES from 'constants/pages';

type Props = {
  builtinCollections: CollectionGroup,
  publishedCollections: CollectionGroup,
  publishedPlaylists: CollectionGroup,
  unpublishedCollections: CollectionGroup,
  // savedCollections: CollectionGroup,
};

export default function CollectionsListMine(props: Props) {
  const {
    builtinCollections,
    publishedPlaylists,
    unpublishedCollections,
    // savedCollections, these are resolved on startup from sync'd claimIds or urls
  } = props;

  const builtinCollectionsList = (Object.values(builtinCollections || {}): any);
  const unpublishedCollectionsList = (Object.keys(unpublishedCollections || {}): any);
  const publishedList = (Object.keys(publishedPlaylists || {}): any);
  const hasCollections = unpublishedCollectionsList.length || publishedList.length;

  const watchLater = builtinCollectionsList.find((list) => list.id === COLLECTIONS_CONSTS.WATCH_LATER_ID);
  const favorites = builtinCollectionsList.find((list) => list.id === COLLECTIONS_CONSTS.FAVORITES_ID);
  const builtin = [watchLater, favorites];
  return (
    <>
      {builtin.map((list: Collection) => {
        const { items: itemUrls } = list;
        return (
          <div className="claim-grid__wrapper" key={list.name}>
            <>
              {Boolean(itemUrls && itemUrls.length) && (
                <>
                  <h1 className="claim-grid__header">
                    <Button
                      className="claim-grid__title"
                      button="link"
                      navigate={`/$/${PAGES.LIST}/${list.id}`}
                      label={list.name}
                    />
                  </h1>
                  <ClaimList
                    tileLayout
                    key={list.name}
                    uris={itemUrls}
                    collectionId={list.id}
                    empty={__('Nothing in %collection_name%', { collection_name: list.name })}
                  />
                </>
              )}
              {!(itemUrls && itemUrls.length) && (
                <h1 className="claim-grid__header claim-grid__title">
                  {__('%collection_name%', { collection_name: list.name })}{' '}
                  <div className="claim-grid__title--empty">(Empty)</div>
                </h1>
              )}
            </>
          </div>
        );
      })}
      {Boolean(hasCollections) && (
        <div className="claim-grid__wrapper">
          <h1 className="claim-grid__header">
            <span className="claim-grid__title">{__('Playlists')}</span>
          </h1>

          <>
            <div className="claim-grid">
              {unpublishedCollectionsList &&
                unpublishedCollectionsList.length > 0 &&
                unpublishedCollectionsList.map((key) => (
                  <CollectionPreviewTile tileLayout collectionId={key} key={key} />
                ))}
              {publishedList &&
                publishedList.length > 0 &&
                publishedList.map((key) => <CollectionPreviewTile tileLayout collectionId={key} key={key} />)}
            </div>
          </>
        </div>
      )}
    </>
  );
}
