// @flow
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {
  selectClaimSearchByQuery,
  selectFetchingClaimSearchByQuery,
  selectClaimsByUri,
  selectById,
} from 'redux/selectors/claims';
import { doClaimSearch, doResolveClaimIds, doResolveUris } from 'redux/actions/claims';
import { doFetchUserMemberships } from 'redux/actions/user';
import * as SETTINGS from 'constants/settings';
import { MATURE_TAGS } from 'constants/tags';
import { doFetchViewCount } from 'lbryinc';
import { selectClientSetting, selectShowMatureContent } from 'redux/selectors/settings';
import { selectMutedAndBlockedChannelIds } from 'redux/selectors/blocked';
import { ENABLE_NO_SOURCE_CLAIMS, SIMPLE_SITE } from 'config';
import * as CS from 'constants/claim_search';
import { createNormalizedClaimSearchKey } from 'util/claim';

import ClaimListDiscover from './view';

const select = (state, props) => {
  const showNsfw = selectShowMatureContent(state);
  const hideReposts = selectClientSetting(state, SETTINGS.HIDE_REPOSTS);
  const forceShowReposts = props.forceShowReposts;
  const mutedAndBlockedChannelIds = selectMutedAndBlockedChannelIds(state);

  // TODO: memoize these 2 function calls. Lots of params, though; might not be feasible.
  const options = resolveSearchOptions({
    showNsfw,
    hideReposts,
    forceShowReposts,
    mutedAndBlockedChannelIds,
    pageSize: 8,
    ...props,
  });
  const searchKey = createNormalizedClaimSearchKey(options);

  return {
    claimSearchResults: selectClaimSearchByQuery(state)[searchKey],
    claimsByUri: selectClaimsByUri(state),
    claimsById: selectById(state),
    fetchingClaimSearch: selectFetchingClaimSearchByQuery(state)[searchKey],
    showNsfw,
    hideReposts,
    // Don't use the query from 'createNormalizedClaimSearchKey(options)' since that doesn't include page & release_time
    optionsStringified: JSON.stringify(options),
  };
};

const perform = {
  doClaimSearch,
  doFetchViewCount,
  doFetchUserMemberships,
  doResolveClaimIds,
  doResolveUris,
};

export default withRouter(connect(select, perform)(ClaimListDiscover));

// ****************************************************************************
// ****************************************************************************

type SearchOptions = {
  page_size: number,
  page: number,
  no_totals: boolean,
  any_tags: Array<string>,
  channel_ids: Array<string>,
  claim_ids?: Array<string>,
  not_channel_ids: Array<string>,
  not_tags: Array<string>,
  order_by: Array<string>,
  languages?: Array<string>,
  release_time?: string,
  claim_type?: string | Array<string>,
  timestamp?: string,
  fee_amount?: string,
  limit_claims_per_channel?: number,
  stream_types?: Array<string>,
  has_source?: boolean,
  has_no_source?: boolean,
};

function resolveSearchOptions(props) {
  const {
    showNsfw,
    hideReposts,
    forceShowReposts,
    mutedAndBlockedChannelIds,
    location,
    pageSize,
    claimType,
    tags,
    languages,
    channelIds,
    orderBy,
    streamTypes,
    hasNoSource,
    hasSource,
    releaseTime,
    feeAmount,
    limitClaimsPerChannel,
    timestamp,
    claimIds,
  } = props;

  const urlParams = new URLSearchParams(location.search);
  const feeAmountInUrl = urlParams.get('fee_amount');
  const feeAmountParam = feeAmountInUrl || feeAmount;

  let streamTypesParam;
  if (streamTypes) {
    streamTypesParam = streamTypes;
  } else if (SIMPLE_SITE && !hasNoSource && streamTypes !== null) {
    streamTypesParam = [CS.FILE_VIDEO, CS.FILE_AUDIO];
  }

  const options: SearchOptions = {
    page: 1,
    page_size: pageSize,
    claim_type: claimType || ['stream', 'repost', 'channel'],
    // no_totals makes it so the sdk doesn't have to calculate total number pages for pagination
    // it's faster, but we will need to remove it if we start using total_pages
    no_totals: true,
    any_tags: tags || [],
    not_tags: !showNsfw ? MATURE_TAGS : [],
    any_languages: languages,
    channel_ids: channelIds || [],
    not_channel_ids: mutedAndBlockedChannelIds,
    order_by: orderBy || ['trending_group', 'trending_mixed'],
    stream_types: streamTypesParam,
    remove_duplicates: true,
  };

  if (ENABLE_NO_SOURCE_CLAIMS && hasNoSource) {
    options.has_no_source = true;
  } else if (hasSource || (!ENABLE_NO_SOURCE_CLAIMS && (!claimType || claimType === 'stream'))) {
    options.has_source = true;
  }

  if (releaseTime) {
    options.release_time = releaseTime;
  }

  if (feeAmountParam) {
    options.fee_amount = feeAmountParam;
  }

  if (limitClaimsPerChannel) {
    options.limit_claims_per_channel = limitClaimsPerChannel;
  }

  // https://github.com/lbryio/lbry-desktop/issues/3774
  if (hideReposts && !forceShowReposts) {
    if (Array.isArray(options.claim_type)) {
      options.claim_type = options.claim_type.filter((claimType) => claimType !== 'repost');
    } else {
      options.claim_type = ['stream', 'channel'];
    }
  }

  if (claimType) {
    options.claim_type = claimType;
  }

  if (timestamp) {
    options.timestamp = timestamp;
  }

  if (claimIds) {
    options.claim_ids = claimIds;
  }

  return options;
}
