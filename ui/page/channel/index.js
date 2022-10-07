import { connect } from 'react-redux';
import {
  selectClaimIsMine,
  selectTitleForUri,
  makeSelectCoverForUri,
  selectCurrentChannelPage,
  selectClaimForUri,
  selectIsClaimOdyseeChannelForUri,
  makeSelectClaimIsPending,
} from 'redux/selectors/claims';
import { selectMyUnpublishedCollections } from 'redux/selectors/collections';
import { selectBlacklistedOutpointMap, doFetchSubCount, selectSubCountForUri } from 'lbryinc';
import { selectYoutubeChannels } from 'redux/selectors/user';
import { selectIsSubscribedForUri } from 'redux/selectors/subscriptions';
import { selectModerationBlockList } from 'redux/selectors/comments';
import { selectMutedChannels } from 'redux/selectors/blocked';
import { doOpenModal } from 'redux/actions/app';
import { selectLanguage } from 'redux/selectors/settings';
import { selectOdyseeMembershipForChannelId, selectMembershipMineData } from 'redux/selectors/memberships';
import { getThumbnailFromClaim } from 'util/claim';
import { doGetMembershipTiersForChannelClaimId, doMembershipMine } from 'redux/actions/memberships';
import ChannelPage from './view';

const select = (state, props) => {
  const claim = selectClaimForUri(state, props.uri);

  return {
    title: selectTitleForUri(state, props.uri),
    thumbnail: getThumbnailFromClaim(claim),
    cover: makeSelectCoverForUri(props.uri)(state),
    channelIsMine: selectClaimIsMine(state, claim),
    page: selectCurrentChannelPage(state),
    claim,
    isSubscribed: selectIsSubscribedForUri(state, props.uri),
    blackListedOutpointMap: selectBlacklistedOutpointMap(state),
    subCount: selectSubCountForUri(state, props.uri),
    pending: makeSelectClaimIsPending(props.uri)(state),
    youtubeChannels: selectYoutubeChannels(state),
    blockedChannels: selectModerationBlockList(state),
    mutedChannels: selectMutedChannels(state),
    unpublishedCollections: selectMyUnpublishedCollections(state),
    lang: selectLanguage(state),
    odyseeMembership: selectOdyseeMembershipForChannelId(state, claim.claim_id),
    myActiveMemberships: selectMembershipMineData(state),
    isOdyseeChannel: selectIsClaimOdyseeChannelForUri(state, props.uri),
  };
};

const perform = (dispatch) => ({
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
  fetchSubCount: (claimId) => dispatch(doFetchSubCount(claimId)),
  getMembershipTiersForChannel: (channelId) => dispatch(doGetMembershipTiersForChannelClaimId(channelId)),
  doMembershipMine: () => dispatch(doMembershipMine()),
});

export default connect(select, perform)(ChannelPage);
