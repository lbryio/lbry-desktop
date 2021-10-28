// @flow
import React from 'react';
import CollectionPreviewTile from 'component/collectionPreviewTile';
import Button from 'component/button';
import Icon from 'component/common/icon';
import * as ICONS from 'constants/icons';
import * as KEYCODES from 'constants/keycodes';
import Paginate from 'component/common/paginate';

import Yrbl from 'component/yrbl';
import classnames from 'classnames';
import { FormField, Form } from 'component/common/form';

type Props = {
  publishedCollections: CollectionGroup,
  unpublishedCollections: CollectionGroup,
  // savedCollections: CollectionGroup,
  fetchingCollections: boolean,
  page: number,
  pageSize: number,
};

const ALL = 'All';
const PRIVATE = 'Private';
const PUBLIC = 'Public';
const COLLECTION_FILTERS = [ALL, PRIVATE, PUBLIC];

export default function PlaylistsMine(props: Props) {
  const {
    publishedCollections,
    unpublishedCollections,
    // savedCollections, these are resolved on startup from sync'd claimIds or urls
    fetchingCollections,
    page = 0,
    pageSize,
  } = props;

  const unpublishedCollectionsList = (Object.keys(unpublishedCollections || {}): any);
  const publishedList = (Object.keys(publishedCollections || {}): any);
  const hasCollections = unpublishedCollectionsList.length || publishedList.length;
  const [filterType, setFilterType] = React.useState(ALL);
  const [searchText, setSearchText] = React.useState('');

  let collectionsToShow = [];
  if (filterType === ALL) {
    collectionsToShow = unpublishedCollectionsList.concat(publishedList);
  } else if (filterType === PRIVATE) {
    collectionsToShow = unpublishedCollectionsList;
  } else if (filterType === PUBLIC) {
    collectionsToShow = publishedList;
  }

  let filteredCollections;
  if (searchText && collectionsToShow) {
    filteredCollections = collectionsToShow.filter((id) => {
      return (
        (unpublishedCollections[id] &&
          unpublishedCollections[id].name.toLocaleLowerCase().includes(searchText.toLocaleLowerCase())) ||
        (publishedCollections[id] &&
          publishedCollections[id].name.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()))
      );
    });
  } else {
    filteredCollections = collectionsToShow || [];
  }

  const shouldPaginate = filteredCollections.length > pageSize;
  const paginateStart = shouldPaginate ? (page - 1) * pageSize : 0;
  const paginatedCollections = filteredCollections.slice(paginateStart, paginateStart + pageSize);

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
      <div className="claim-grid__wrapper">
        <div className="claim-grid__header section">
          <h1 className="claim-grid__title">
            {__('Playlists')}
            {!hasCollections && !fetchingCollections && (
              <div className="claim-grid__title--empty">{__('(Empty) --[indicates empty playlist]--')}</div>
            )}
            {!hasCollections && fetchingCollections && (
              <div className="claim-grid__title--empty">{__('(Empty) --[indicates empty playlist]--')}</div>
            )}
          </h1>
        </div>
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
        {Boolean(hasCollections) && (
          <div>
            {/* TODO: fix above spacing hack */}

            <div className="claim-grid">
              {paginatedCollections &&
                paginatedCollections.length > 0 &&
                paginatedCollections.map((key) => <CollectionPreviewTile tileLayout collectionId={key} key={key} />)}
              {!paginatedCollections.length && <div className="empty main--empty">{__('No matching playlists')}</div>}
            </div>
            {shouldPaginate && (
              <Paginate
                totalPages={
                  filteredCollections.length > 0 ? Math.ceil(filteredCollections.length / Number(pageSize)) : 1
                }
              />
            )}
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
