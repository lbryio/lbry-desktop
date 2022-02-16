// @flow
import { SIMPLE_SITE } from 'config';
import type { Node } from 'react';
import * as CS from 'constants/claim_search';
import React from 'react';
import { withRouter } from 'react-router';
import { MATURE_TAGS } from 'constants/tags';
import ClaimList from 'component/claimList';
import ClaimPreview from 'component/claimPreview';
import ClaimPreviewTile from 'component/claimPreviewTile';
import ClaimListHeader from 'component/claimListHeader';
import useFetchViewCount from 'effects/use-fetch-view-count';

export type SearchOptions = {
  size?: number,
  from?: number,
  related_to?: string,
  nsfw?: boolean,
  channel_id?: string,
  isBackgroundSearch?: boolean,
};

type Props = {
  uris: Array<string>,
  type: string,
  pageSize: number,

  fetchViewCount?: boolean,
  hideAdvancedFilter?: boolean,
  hideFilters?: boolean,
  infiniteScroll?: Boolean,
  showHeader: boolean,
  showHiddenByUser?: boolean,
  tileLayout: boolean,

  defaultOrderBy?: string,
  defaultFreshness?: string,

  tags: string, // these are just going to be string. pass a CSV if you want multi
  defaultTags: string,

  claimType?: string | Array<string>,

  streamType?: string | Array<string>,
  defaultStreamType?: string | Array<string>,

  empty?: string,
  feeAmount?: string,
  repostedClaimId?: string,
  maxPages?: number,

  channelIds?: Array<string>,
  claimId: string,

  header?: Node,
  headerLabel?: string | Node,
  injectedItem: ?Node,
  meta?: Node,

  location: { search: string, pathname: string },

  // --- select ---
  claimsByUri: { [string]: any },
  loading: boolean,
  searchResult: Array<string>,
  searchResultLastPageReached: boolean,

  // --- perform ---
  doFetchViewCount: (claimIdCsv: string) => void,
  doSearch: (query: string, options: SearchOptions) => void,

  hideLayoutButton?: boolean,
  maxClaimRender?: number,
  useSkeletonScreen?: boolean,
  excludeUris?: Array<string>,

  swipeLayout: boolean,

  showMature: boolean,
  searchKeyword: string,
  searchOptions: SearchOptions,
};

function ClaimListSearch(props: Props) {
  const {
    showHeader = true,
    type,
    tags,
    defaultTags,
    loading,
    meta,
    channelIds,
    // eslint-disable-next-line no-unused-vars
    claimId,
    fetchViewCount,
    location,
    defaultOrderBy,
    headerLabel,
    header,
    claimType,
    pageSize,
    streamType,
    defaultStreamType = SIMPLE_SITE ? [CS.FILE_VIDEO, CS.FILE_AUDIO] : undefined, // add param for DEFAULT_STREAM_TYPE
    defaultFreshness = CS.FRESH_WEEK,
    repostedClaimId,
    hideAdvancedFilter,
    infiniteScroll = true,
    injectedItem,
    feeAmount,
    uris,
    tileLayout,
    hideFilters = false,
    maxPages,
    showHiddenByUser = false,
    empty,
    claimsByUri,
    doFetchViewCount,
    hideLayoutButton = false,
    maxClaimRender,
    useSkeletonScreen = true,
    excludeUris = [],
    swipeLayout = false,

    // search
    showMature,
    searchKeyword,
    searchOptions,
    searchResult,
    searchResultLastPageReached,
    doSearch,
  } = props;
  const { search } = location;
  const [page, setPage] = React.useState(1);
  const urlParams = new URLSearchParams(search);
  const tagsParam = // can be 'x,y,z' or 'x' or ['x','y'] or CS.CONSTANT
    (tags && getParamFromTags(tags)) ||
    (urlParams.get(CS.TAGS_KEY) !== null && urlParams.get(CS.TAGS_KEY)) ||
    (defaultTags && getParamFromTags(defaultTags));
  const hasMatureTags = tagsParam && tagsParam.split(',').some((t) => MATURE_TAGS.includes(t));

  const renderUris = uris || searchResult;

  // **************************************************************************
  // Helpers
  // **************************************************************************
  function getParamFromTags(t) {
    if (t === CS.TAGS_ALL || t === CS.TAGS_FOLLOWED) {
      return t;
    } else if (Array.isArray(t)) {
      return t.join(',');
    }
  }

  function handleScrollBottom() {
    if (maxPages !== undefined && page === maxPages) {
      return;
    }

    if (!loading && infiniteScroll) {
      if (searchResult && !searchResultLastPageReached) {
        setPage(page + 1);
      }
    }
  }

  // **************************************************************************
  // **************************************************************************

  useFetchViewCount(fetchViewCount, renderUris, claimsByUri, doFetchViewCount);

  React.useEffect(() => {
    doSearch(
      searchKeyword,
      showMature
        ? searchOptions
        : {
            ...searchOptions,
            from: pageSize * (page - 1),
          }
    );
  }, [doSearch, searchKeyword, showMature, pageSize, page]);

  const headerToUse = header || (
    <ClaimListHeader
      channelIds={channelIds}
      defaultTags={defaultTags}
      tags={tags}
      defaultFreshness={defaultFreshness}
      claimType={claimType}
      streamType={streamType}
      defaultStreamType={defaultStreamType}
      feeAmount={feeAmount} // ENABLE_PAID_CONTENT_DISCOVER or something
      defaultOrderBy={defaultOrderBy}
      hideAdvancedFilter={hideAdvancedFilter}
      hasMatureTags={hasMatureTags}
      setPage={setPage}
      tileLayout={tileLayout}
      hideLayoutButton={hideLayoutButton}
      hideFilters={hideFilters}
    />
  );

  return (
    <React.Fragment>
      {headerLabel && <label className="claim-list__header-label">{headerLabel}</label>}
      {tileLayout ? (
        <div>
          {!repostedClaimId && (
            <div className="section__header--actions">
              {headerToUse}
              {meta && <div className="section__actions--no-margin">{meta}</div>}
            </div>
          )}
          <ClaimList
            tileLayout
            loading={loading}
            uris={renderUris}
            onScrollBottom={handleScrollBottom}
            page={page}
            pageSize={pageSize}
            injectedItem={injectedItem}
            showHiddenByUser={showHiddenByUser}
            empty={empty}
            maxClaimRender={maxClaimRender}
            excludeUris={excludeUris}
            swipeLayout={swipeLayout}
          />
          {loading && useSkeletonScreen && (
            <div className="claim-grid">
              {new Array(pageSize).fill(1).map((x, i) => (
                <ClaimPreviewTile key={i} placeholder="loading" />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          {showHeader && (
            <div className="section__header--actions">
              {headerToUse}
              {meta && <div className="section__actions--no-margin">{meta}</div>}
            </div>
          )}
          <ClaimList
            type={type}
            loading={loading}
            uris={renderUris}
            onScrollBottom={handleScrollBottom}
            page={page}
            pageSize={pageSize}
            injectedItem={injectedItem}
            showHiddenByUser={showHiddenByUser}
            empty={empty}
            maxClaimRender={maxClaimRender}
            excludeUris={excludeUris}
            swipeLayout={swipeLayout}
          />
          {loading &&
            useSkeletonScreen &&
            new Array(pageSize).fill(1).map((x, i) => <ClaimPreview key={i} placeholder="loading" type={type} />)}
        </div>
      )}
    </React.Fragment>
  );
}

export default withRouter(ClaimListSearch);
