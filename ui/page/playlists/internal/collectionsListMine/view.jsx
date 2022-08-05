// @flow
import React from 'react';
import CollectionPreview from './internal/collectionPreview';
import Button from 'component/button';
import * as MODALS from 'constants/modal_types';
import * as COLS from 'constants/collections';
import Yrbl from 'component/yrbl';
import classnames from 'classnames';
import { useIsMobile } from 'effects/use-screensize';
import { useHistory } from 'react-router-dom';
import BuiltinPlaylists from './internal/builtin-playlists';
import SectionLabel from './internal/label';
import TableHeader from './internal/table-header';
import CollectionListHeader from './internal/collectionListHeader/index';
import Paginate from 'component/common/paginate';
import usePersistedState from 'effects/use-persisted-state';
import PageItemsLabel from './internal/page-items-label';

type Props = {
  publishedCollections: CollectionGroup,
  unpublishedCollections: CollectionGroup,
  editedCollections: CollectionGroup,
  updatedCollections: CollectionGroup,
  savedCollections: CollectionGroup,
  savedCollectionIds: ClaimIds,
  featuredChannelsIds: Array<CollectionId>,
  isFetchingCollections: boolean,
  areBuiltinCollectionsEmpty: boolean,
  hasCollections: boolean,
  doOpenModal: (id: string) => void,
  doFetchItemsInCollections: (params: { collectionIds: ClaimIds }) => void,
};

// Avoid prop drilling
export const CollectionsListContext = React.createContext<any>();

export default function CollectionsListMine(props: Props) {
  const {
    publishedCollections,
    unpublishedCollections,
    editedCollections,
    updatedCollections,
    savedCollections,
    savedCollectionIds,
    featuredChannelsIds,
    isFetchingCollections,
    areBuiltinCollectionsEmpty,
    hasCollections,
    doOpenModal,
    doFetchItemsInCollections,
  } = props;

  const isMobile = useIsMobile();

  const {
    push,
    location: { search },
  } = useHistory();

  const urlParams = new URLSearchParams(search);
  const sortByParam = Object.keys(COLS.SORT_VALUES).find((key) => urlParams.get(key));
  const defaultSortOption = sortByParam ? { key: sortByParam, value: urlParams.get(sortByParam) } : COLS.DEFAULT_SORT;

  const [filterType, setFilterType] = React.useState(COLS.LIST_TYPE.ALL);
  const [searchText, setSearchText] = React.useState('');
  const [sortOption, setSortOption] = usePersistedState('playlists-sort', defaultSortOption);
  const [persistedOption, setPersistedOption] = React.useState(sortOption);

  const unpublishedCollectionsList = (Object.keys(unpublishedCollections || {}): any);
  const publishedList = (Object.keys(publishedCollections || {}): any);
  const editedList = (Object.keys(editedCollections || {}): any);
  const savedList = (Object.keys(savedCollections || {}): any);
  const collectionsUnresolved = unpublishedCollectionsList.length === 0 && publishedList.length === 0 && hasCollections;
  const playlistShowCount = isMobile ? COLS.PLAYLIST_SHOW_COUNT.MOBILE : COLS.PLAYLIST_SHOW_COUNT.DEFAULT;

  const collectionsToShow = React.useMemo(() => {
    let collections;
    switch (filterType) {
      case COLS.LIST_TYPE.ALL:
        collections = unpublishedCollectionsList.concat(publishedList).concat(savedList);
        break;
      case COLS.LIST_TYPE.PRIVATE:
        collections = unpublishedCollectionsList;
        break;
      case COLS.LIST_TYPE.PUBLIC:
        collections = publishedList;
        break;
      case COLS.LIST_TYPE.EDITED:
        collections = editedList;
        break;
      case COLS.LIST_TYPE.SAVED:
        collections = savedList;
        break;
      default:
        collections = [];
        break;
    }
    return collections.filter((id) => !featuredChannelsIds.includes(id));
  }, [editedList, filterType, publishedList, savedList, unpublishedCollectionsList, featuredChannelsIds]);

  const page = (collectionsToShow.length > playlistShowCount && Number(urlParams.get('page'))) || 1;
  const firstItemIndexForPage = playlistShowCount * (page - 1);
  const lastItemIndexForPage = playlistShowCount * page;

  const filteredCollections = React.useMemo(() => {
    let result = collectionsToShow;

    if (searchText) {
      result = collectionsToShow.filter(
        (id) =>
          (unpublishedCollections[id] &&
            unpublishedCollections[id].name.toLocaleLowerCase().includes(searchText.toLocaleLowerCase())) ||
          (publishedCollections[id] &&
            publishedCollections[id].name.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()))
      );
    }

    return result.sort((a, b) => {
      let itemA = unpublishedCollections[a] || publishedCollections[a] || editedCollections[a] || savedCollections[a];
      let itemB = unpublishedCollections[b] || publishedCollections[b] || editedCollections[b] || savedCollections[b];

      if (updatedCollections[a]) {
        itemA = { ...itemA, ...updatedCollections[a] };
      }
      if (updatedCollections[b]) {
        itemB = { ...itemB, ...updatedCollections[b] };
      }

      const firstItem =
        // Timestamps are reversed since newest timestamps will be higher, so show the highest number first
        [COLS.SORT_KEYS.UPDATED_AT, COLS.SORT_KEYS.CREATED_AT].includes(sortOption.key)
          ? sortOption.value === COLS.SORT_ORDER.DESC
            ? itemA
            : itemB
          : sortOption.value === COLS.SORT_ORDER.ASC
          ? itemA
          : itemB;
      const secondItem = firstItem === itemA ? itemB : itemA;
      const comparisonObj =
        sortOption.key === COLS.SORT_KEYS.COUNT
          ? { a: firstItem.items.length, b: secondItem.items.length }
          : { a: firstItem[sortOption.key], b: secondItem[sortOption.key] };

      if (sortOption.key === COLS.SORT_KEYS.NAME) {
        // $FlowFixMe
        return comparisonObj.a.localeCompare(comparisonObj.b);
      }

      if ((comparisonObj.a || 0) > (comparisonObj.b || 0)) {
        return 1;
      }
      if ((comparisonObj.a || 0) < (comparisonObj.b || 0)) {
        return -1;
      }
      return 0;
    });
  }, [
    collectionsToShow,
    editedCollections,
    publishedCollections,
    savedCollections,
    searchText,
    sortOption.key,
    sortOption.value,
    unpublishedCollections,
    updatedCollections,
  ]);

  const totalLength = collectionsToShow.length;
  const filteredCollectionsLength = filteredCollections.length;
  const totalPages = Math.ceil(filteredCollectionsLength / playlistShowCount);
  const paginatedCollections = filteredCollections.slice(
    totalPages >= page ? firstItemIndexForPage : 0,
    lastItemIndexForPage
  );

  React.useEffect(() => {
    if (savedCollectionIds.length > 0) {
      doFetchItemsInCollections({ collectionIds: savedCollectionIds });
    }
  }, [doFetchItemsInCollections, savedCollectionIds]);

  function handleCreatePlaylist() {
    doOpenModal(MODALS.COLLECTION_CREATE);
  }

  if (areBuiltinCollectionsEmpty && !hasCollections) {
    return (
      <div className="claim-grid__wrapper">
        <BuiltinPlaylists />

        <div className="main--empty">
          <Yrbl
            type="happy"
            title={__('You can add videos to your Playlists')}
            subtitle={__('Do you want to find some content to save for later, or create a brand new playlist?')}
            actions={
              <div className="section__actions">
                <Button button="secondary" label={__('Explore!')} onClick={() => push('/')} />
                <Button button="primary" label={__('New Playlist')} onClick={handleCreatePlaylist} />
              </div>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="claim-grid__wrapper">
        <BuiltinPlaylists />

        <SectionLabel label={__('Your Playlists')} />

        <CollectionsListContext.Provider
          value={{
            searchText,
            setSearchText,
            totalLength,
            filteredCollectionsLength,
          }}
        >
          <CollectionListHeader
            filterType={filterType}
            isTruncated={totalLength > filteredCollectionsLength}
            setFilterType={setFilterType}
            // $FlowFixMe
            sortOption={sortOption}
            setSortOption={setSortOption}
            persistedOption={persistedOption}
            setPersistedOption={setPersistedOption}
          />
        </CollectionsListContext.Provider>

        {/* Playlists: previews */}
        {hasCollections && !collectionsUnresolved ? (
          filteredCollectionsLength > 0 ? (
            <ul className={classnames('ul--no-style claim-list', { playlists: !isMobile })}>
              {!isMobile && <TableHeader />}

              {paginatedCollections.map((key) => (
                <CollectionPreview collectionId={key} key={key} />
              ))}

              {totalPages > 1 && (
                <PageItemsLabel
                  totalLength={filteredCollectionsLength}
                  firstItemIndexForPage={firstItemIndexForPage}
                  paginatedCollectionsLength={paginatedCollections.length}
                />
              )}

              <Paginate totalPages={totalPages} />
            </ul>
          ) : (
            <div className="empty main--empty">{__('No matching playlists')}</div>
          )
        ) : (
          <div className="main--empty">
            {!isFetchingCollections && !collectionsUnresolved ? (
              <Yrbl
                type="sad"
                title={__('You have no Playlists yet. Better start hoarding!')}
                actions={
                  <div className="section__actions">
                    <Button button="primary" label={__('Create a Playlist')} onClick={handleCreatePlaylist} />
                  </div>
                }
              />
            ) : (
              <h2 className="main--empty empty">{__('Loading...')}</h2>
            )}
          </div>
        )}
      </div>
    </>
  );
}
