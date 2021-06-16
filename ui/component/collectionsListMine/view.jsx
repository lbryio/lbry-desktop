// @flow
import React from 'react';
import CollectionPreviewTile from 'component/collectionPreviewTile';
import ClaimList from 'component/claimList';
import Button from 'component/button';
import { COLLECTIONS_CONSTS } from 'lbry-redux';
import Icon from 'component/common/icon';
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import Yrbl from 'component/yrbl';
import usePersistedState from 'effects/use-persisted-state';
import Card from 'component/common/card';

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
  const [showHelp, setShowHelp] = usePersistedState('livestream-help-seen', true);

  const helpText = (
    <div className="section__subtitle">
      <p>{__(`Thanks for checking out our new lists feature!`)}</p>
      <p>{__(`Everyone starts with 2 private lists - Watch Later and Favorites.`)}</p>
      <p>{__(`From content pages or content preview menus, you can add content to lists or create new lists.`)}</p>
      <p>
        {__(
          `By default, lists are private. You can edit them and later publish to a channel (or anonymously) from the List page or the Publish context menu on this page. Similar to uploads, transaction fees and bidding apply.`
        )}
      </p>
      <p>
        {__(
          `Right now, lists are for playable content only. Lots of other improvements and features are in the works, stay tuned!`
        )}
      </p>
    </div>
  );

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
                      label={
                        <span className="claim-grid__title-span">
                          {list.name}
                          <div className="claim-grid__title--empty">
                            <Icon className="icon--margin-right" icon={ICONS.STACK} />
                            {itemUrls.length}
                          </div>
                        </span>
                      }
                    />
                  </h1>
                  <ClaimList tileLayout key={list.name} uris={itemUrls.slice(0, 6)} collectionId={list.id} />
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
      <div className="claim-grid__wrapper">
        <div className="claim-grid__header claim-grid__header--between section">
          <h1 className="claim-grid__title">
            {__('Playlists')}
            {!hasCollections && <div className="claim-grid__title--empty">(Empty)</div>}
          </h1>
          <Button button="link" onClick={() => setShowHelp(!showHelp)} label={__('How does this work?')} />
        </div>
        {showHelp && (
          <Card
            titleActions={<Button button="close" icon={ICONS.REMOVE} onClick={() => setShowHelp(false)} />}
            title={__('Introducing Lists')}
            actions={helpText}
          />
        )}
        {Boolean(hasCollections) && (
          <div className="section">
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
          </div>
        )}
        {!hasCollections && (
          <div className="main--empty">
            <Yrbl
              type={'sad'}
              title={__('You have no lists yet. Better start hoarding!')}
              // actions={
              //   <div className="section__actions">
              //     <Button button="primary" label={__('View Content')} onClick={() => setViewBlockedChannel(true)} />
              //   </div>
              // }
            />
          </div>
        )}
      </div>
    </>
  );
}
