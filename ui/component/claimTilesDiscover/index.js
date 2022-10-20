// @flow
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {
  selectClaimSearchByQuery,
  selectFetchingClaimSearchByQuery,
  selectClaimsByUri,
  selectById,
  selectClaimSearchByQueryLastPageReached,
} from 'redux/selectors/claims';
import { doClaimSearch, doResolveClaimIds, doResolveUris } from 'redux/actions/claims';
import { doFetchOdyseeMembershipForChannelIds } from 'redux/actions/memberships';
import * as SETTINGS from 'constants/settings';
import { doFetchViewCount } from 'lbryinc';
import { selectClientSetting, selectShowMatureContent } from 'redux/selectors/settings';
import { selectMutedAndBlockedChannelIds } from 'redux/selectors/blocked';
import { ENABLE_NO_SOURCE_CLAIMS, SIMPLE_SITE } from 'config';
import { createNormalizedClaimSearchKey } from 'util/claim';
import { CsOptions } from 'util/claim-search';

import ClaimListDiscover from './view';

function resolveHideMembersOnly(global, override) {
  return override === undefined || override === null ? global : override;
}

const select = (state, props) => {
  const showNsfw = selectShowMatureContent(state);
  const hmocSetting = selectClientSetting(state, SETTINGS.HIDE_MEMBERS_ONLY_CONTENT);
  const hideMembersOnly = resolveHideMembersOnly(hmocSetting, props.hideMembersOnly);
  const hideReposts = selectClientSetting(state, SETTINGS.HIDE_REPOSTS);
  const forceShowReposts = props.forceShowReposts;
  const mutedAndBlockedChannelIds = selectMutedAndBlockedChannelIds(state);

  // TODO: memoize these 2 function calls. Lots of params, though; might not be feasible.
  const options = resolveSearchOptions({
    showNsfw,
    hideMembersOnly,
    hideReposts,
    forceShowReposts,
    mutedAndBlockedChannelIds,
    pageSize: 8,
    ...props,
  });
  const searchKey = createNormalizedClaimSearchKey(options);

  return {
    claimSearchResults: selectClaimSearchByQuery(state)[searchKey],
    claimSearchLastPageReached: selectClaimSearchByQueryLastPageReached(state)[searchKey],
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
  doFetchOdyseeMembershipForChannelIds,
  doResolveClaimIds,
  doResolveUris,
};

export default withRouter(connect(select, perform)(ClaimListDiscover));

// ****************************************************************************
// ****************************************************************************

function resolveSearchOptions(props) {
  const {
    showNsfw,
    hideReposts,
    forceShowReposts,
    hideMembersOnly,
    mutedAndBlockedChannelIds,
    location,
    pageSize,
    claimType,
    tags,
    notTags,
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
    duration,
  } = props;

  const urlParams = new URLSearchParams(location.search);
  const feeAmountInUrl = urlParams.get('fee_amount');
  const feeAmountParam = feeAmountInUrl || feeAmount;

  let streamTypesParam;
  if (streamTypes) {
    streamTypesParam = streamTypes;
  } else if (SIMPLE_SITE && !hasNoSource && streamTypes !== null) {
    streamTypesParam = undefined;
  }

  const options: ClaimSearchOptions = {
    page: 1,
    page_size: pageSize,
    claim_type: claimType || ['stream', 'repost', 'channel'],
    // no_totals makes it so the sdk doesn't have to calculate total number pages for pagination
    // it's faster, but we will need to remove it if we start using total_pages
    no_totals: true,
    any_tags: tags || [],
    not_tags: CsOptions.not_tags(notTags, showNsfw, hideMembersOnly),
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

  if (duration) {
    options.duration = duration;
  }

  return options;
}
