// @flow
import React from 'react';
import CollectionPreviewTile from 'component/collectionPreviewTile';
import ClaimList from 'component/claimList';
import Button from 'component/button';
import * as COLLECTIONS_CONSTS from 'constants/collections';
import Icon from 'component/common/icon';
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import * as KEYCODES from 'constants/keycodes';
import Yrbl from 'component/yrbl';
import classnames from 'classnames';
import { FormField, Form } from 'component/common/form';
import { useIsMobile } from 'effects/use-screensize';

type Props = {
  builtinCollections: CollectionGroup,
  publishedCollections: CollectionGroup,
  unpublishedCollections: CollectionGroup,
  // savedCollections: CollectionGroup,
  fetchingCollections: boolean,
};

const LIST_TYPE = Object.freeze({ ALL: 'All', PRIVATE: 'Private', PUBLIC: 'Public' });
const COLLECTION_FILTERS = [LIST_TYPE.ALL, LIST_TYPE.PRIVATE, LIST_TYPE.PUBLIC];
const PLAYLIST_SHOW_COUNT = Object.freeze({ DEFAULT: 12, MOBILE: 6 });

export default function CollectionsListMine(props: Props) {
  const {
    builtinCollections,
    publishedCollections,
    unpublishedCollections,
    // savedCollections, these are resolved on startup from sync'd claimIds or urls
    fetchingCollections,
  } = props;

  const builtinCollectionsList = (Object.values(builtinCollections || {}): any);
  const unpublishedCollectionsList = (Object.keys(unpublishedCollections || {}): any);
  const publishedList = (Object.keys(publishedCollections || {}): any);
  const hasCollections = unpublishedCollectionsList.length || publishedList.length;
  const [filterType, setFilterType] = React.useState(LIST_TYPE.ALL);
  const [searchText, setSearchText] = React.useState('');
  const isMobileScreen = useIsMobile();
  const playlistShowCount = isMobileScreen ? PLAYLIST_SHOW_COUNT.MOBILE : PLAYLIST_SHOW_COUNT.DEFAULT;

  const playlistPageUrl = `/$/${PAGES.PLAYLISTS}?type=${filterType}`;
  let collectionsToShow = [];
  if (filterType === LIST_TYPE.ALL) {
    collectionsToShow = unpublishedCollectionsList.concat(publishedList);
  } else if (filterType === LIST_TYPE.PRIVATE) {
    collectionsToShow = unpublishedCollectionsList;
  } else if (filterType === LIST_TYPE.PUBLIC) {
    collectionsToShow = publishedList;
  }

  let filteredCollections;
  if (searchText && collectionsToShow) {
    filteredCollections = collectionsToShow
      .filter((id) => {
        return (
          (unpublishedCollections[id] &&
            unpublishedCollections[id].name.toLocaleLowerCase().includes(searchText.toLocaleLowerCase())) ||
          (publishedCollections[id] &&
            publishedCollections[id].name.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()))
        );
      })
      .slice(0, playlistShowCount);
  } else {
    filteredCollections = collectionsToShow.slice(0, playlistShowCount) || [];
  }

  const totalLength = collectionsToShow ? collectionsToShow.length : 0;
  const filteredLength = filteredCollections.length;
  const isTruncated = totalLength > filteredLength;

  const watchLater = builtinCollectionsList.find((list) => list.id === COLLECTIONS_CONSTS.WATCH_LATER_ID);
  const favorites = builtinCollectionsList.find((list) => list.id === COLLECTIONS_CONSTS.FAVORITES_ID);
  const builtin = [watchLater, favorites];
  function escapeListener(e: SyntheticKeyboardEvent<*>) {
    if (e.keyCode === KEYCODES.ESCAPE) {
      e.preventDefault();
      setSearchText('');
    }
  }

  function onTextareaFocus() {
    window.addEventListener('keydown', escapeListener);
  }

  function onTextareaBlur() {
    window.removeEventListener('keydown', escapeListener);
  }
  return (
    <>
      {/* Built-in lists */}
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
                          {__(`${list.name}`)}
                          <div className="claim-grid__title--empty">
                            <Icon
                              className="icon--margin-right"
                              icon={
                                (list.id === COLLECTIONS_CONSTS.WATCH_LATER_ID && ICONS.TIME) ||
                                (list.id === COLLECTIONS_CONSTS.FAVORITES_ID && ICONS.STAR) ||
                                ICONS.STACK
                              }
                            />
                            {itemUrls.length}
                          </div>
                        </span>
                      }
                    />
                  </h1>
                  <ClaimList
                    swipeLayout={isMobileScreen}
                    tileLayout
                    key={list.name}
                    uris={itemUrls.slice(0, 6)}
                    collectionId={list.id}
                    showUnresolvedClaims
                  />
                </>
              )}
              {!(itemUrls && itemUrls.length) && (
                <h1 className="claim-grid__header claim-grid__title">
                  {__(`${list.name}`)}
                  <div className="claim-grid__title--empty">{__('(Empty) --[indicates empty playlist]--')}</div>
                </h1>
              )}
            </>
          </div>
        );
      })}

      {/* Playlists: header */}
      <div className="claim-grid__wrapper">
        <div className="claim-grid__header section">
          <h1 className="claim-grid__title">
            <Button
              className="claim-grid__title"
              button="link"
              navigate={playlistPageUrl}
              label={
                <span className="claim-grid__title-span">
                  {__('Playlists')}
                  <div className="claim-grid__title--empty">
                    <Icon className="icon--margin-right" icon={ICONS.STACK} />
                  </div>
                </span>
              }
            />
            {!hasCollections && !fetchingCollections && (
              <div className="claim-grid__title--empty">{__('(Empty) --[indicates empty playlist]--')}</div>
            )}
            {!hasCollections && fetchingCollections && (
              <div className="claim-grid__title--empty">{__('(Empty) --[indicates empty playlist]--')}</div>
            )}
          </h1>
        </div>

        {/* Playlists: search */}
        <div className="section__header-action-stack">
          <div className="section__header--actions">
            <div className="claim-search__wrapper">
              <div className="claim-search__menu-group">
                {COLLECTION_FILTERS.map((value) => (
                  <Button
                    label={__(value)}
                    key={value}
                    button="alt"
                    onClick={() => setFilterType(value)}
                    className={classnames('button-toggle', {
                      'button-toggle--active': filterType === value,
                    })}
                  />
                ))}
              </div>
            </div>
            <Form onSubmit={() => {}} className="wunderbar--inline">
              <Icon icon={ICONS.SEARCH} />
              <FormField
                name="collection_search"
                onFocus={onTextareaFocus}
                onBlur={onTextareaBlur}
                className="wunderbar__input--inline"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                type="text"
                placeholder={__('Search')}
              />
            </Form>
          </div>
          <p className="collection-grid__results-summary">
            {isTruncated && (
              <>
                {__('Showing %filtered% results of %total%', { filtered: filteredLength, total: totalLength })}
                {`${searchText ? ' (' + __('filtered') + ') ' : ' '}`}
              </>
            )}
            <Button
              button="link"
              navigate={playlistPageUrl}
              label={<span className="claim-grid__title-span">{__('View All Playlists')}</span>}
            />
          </p>
        </div>

        {/* Playlists: tiles */}
        {Boolean(hasCollections) && (
          <div>
            <div
              className={classnames('claim-grid', {
                'swipe-list': isMobileScreen,
              })}
            >
              {filteredCollections &&
                filteredCollections.length > 0 &&
                filteredCollections.map((key) => (
                  <CollectionPreviewTile swipeLayout={isMobileScreen} tileLayout collectionId={key} key={key} />
                ))}
              {!filteredCollections.length && <div className="empty main--empty">{__('No matching playlists')}</div>}
            </div>
          </div>
        )}
        {!hasCollections && !fetchingCollections && (
          <div className="main--empty">
            <Yrbl type={'sad'} title={__('You have no lists yet. Better start hoarding!')} />
          </div>
        )}
        {!hasCollections && fetchingCollections && (
          <div className="main--empty">
            <h2 className="main--empty empty">{__('Loading...')}</h2>
          </div>
        )}
      </div>
    </>
  );
}
