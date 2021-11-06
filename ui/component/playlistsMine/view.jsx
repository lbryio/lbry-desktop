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
  history: { replace: (string) => void },
  location: { search: string },
};

const ALL = 'All';
const PRIVATE = 'Private';
const PUBLIC = 'Public';
const COLLECTION_FILTERS = [ALL, PRIVATE, PUBLIC];
const FILTER_TYPE_PARAM = 'type';
const PAGE_PARAM = 'page';

export default function PlaylistsMine(props: Props) {
  const {
    publishedCollections,
    unpublishedCollections,
    // savedCollections, these are resolved on startup from sync'd claimIds or urls
    fetchingCollections,
    history,
    location,
  } = props;

  const { search } = location;
  const urlParams = new URLSearchParams(search);
  const page = Number(urlParams.get(PAGE_PARAM)) || 1;
  const type = urlParams.get(FILTER_TYPE_PARAM) || ALL;
  const pageSize = 12;

  const unpublishedCollectionsList = (Object.keys(unpublishedCollections || {}): any);
  const publishedList = (Object.keys(publishedCollections || {}): any);
  const hasCollections = unpublishedCollectionsList.length || publishedList.length;
  const [filterType, setFilterType] = React.useState(type);
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
  const paginateStartIndex = shouldPaginate ? (page - 1) * pageSize : 0;
  const paginateEndIndex = paginateStartIndex + pageSize;
  const paginatedCollections = filteredCollections.slice(paginateStartIndex, paginateEndIndex);

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

  function handleFilterType(val) {
    const newParams = new URLSearchParams();
    if (val) {
      newParams.set(FILTER_TYPE_PARAM, val);
    }
    newParams.set(PAGE_PARAM, '1');
    history.replace(`?${newParams.toString()}`);
    setFilterType(val);
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
                  onClick={() => handleFilterType(value)}
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
