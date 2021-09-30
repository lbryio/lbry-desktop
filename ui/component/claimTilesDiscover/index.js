import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {
  doClaimSearch,
  selectClaimSearchByQuery,
  selectFetchingClaimSearchByQuery,
  SETTINGS,
  selectClaimsByUri,
  MATURE_TAGS,
} from 'lbry-redux';
import { doFetchViewCount } from 'lbryinc';
import { doToggleTagFollowDesktop } from 'redux/actions/tags';
import { makeSelectClientSetting, selectShowMatureContent } from 'redux/selectors/settings';
import { selectMutedAndBlockedChannelIds } from 'redux/selectors/blocked';
import { ENABLE_NO_SOURCE_CLAIMS, SIMPLE_SITE } from 'config';
import * as CS from 'constants/claim_search';

import ClaimListDiscover from './view';

const select = (state, props) => {
  const showNsfw = selectShowMatureContent(state);
  const hideReposts = makeSelectClientSetting(SETTINGS.HIDE_REPOSTS)(state);
  const mutedAndBlockedChannelIds = selectMutedAndBlockedChannelIds(state);

  return {
    claimSearchByQuery: selectClaimSearchByQuery(state),
    claimsByUri: selectClaimsByUri(state),
    fetchingClaimSearchByQuery: selectFetchingClaimSearchByQuery(state),
    showNsfw,
    hideReposts,
    options: resolveSearchOptions({ showNsfw, hideReposts, mutedAndBlockedChannelIds, pageSize: 8, ...props }),
  };
};

const perform = {
  doClaimSearch,
  doToggleTagFollowDesktop,
  doFetchViewCount,
};

export default withRouter(connect(select, perform)(ClaimListDiscover));

// ****************************************************************************
// ****************************************************************************

function resolveSearchOptions(props) {
  const {
    showNsfw,
    hideReposts,
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

  const options = {
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
  if (hideReposts) {
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
