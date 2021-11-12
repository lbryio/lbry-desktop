import { connect } from 'react-redux';
import {
  selectClaimIsMine,
  makeSelectTitleForUri,
  getThumbnailFromClaim,
  makeSelectCoverForUri,
  selectCurrentChannelPage,
  selectClaimForUri,
  makeSelectClaimIsPending,
} from 'redux/selectors/claims';
import { selectMyUnpublishedCollections } from 'redux/selectors/collections';
import { selectBlackListedOutpoints, doFetchSubCount, selectSubCountForUri } from 'lbryinc'; // ban state
import { selectYoutubeChannels } from 'redux/selectors/user';
import { makeSelectIsSubscribed } from 'redux/selectors/subscriptions';
import { selectModerationBlockList } from 'redux/selectors/comments';
import { selectMutedChannels } from 'redux/selectors/blocked';
import { doOpenModal } from 'redux/actions/app';
import ChannelPage from './view';

const select = (state, props) => {
  const claim = selectClaimForUri(state, props.uri);

  return {
    title: makeSelectTitleForUri(props.uri)(state),
    thumbnail: getThumbnailFromClaim(claim),
    cover: makeSelectCoverForUri(props.uri)(state),
    channelIsMine: selectClaimIsMine(state, claim),
    page: selectCurrentChannelPage(state),
    claim,
    isSubscribed: makeSelectIsSubscribed(props.uri, true)(state),
    blackListedOutpoints: selectBlackListedOutpoints(state),
    subCount: selectSubCountForUri(state, props.uri),
    pending: makeSelectClaimIsPending(props.uri)(state),
    youtubeChannels: selectYoutubeChannels(state),
    blockedChannels: selectModerationBlockList(state), // banlist
    mutedChannels: selectMutedChannels(state),
    unpublishedCollections: selectMyUnpublishedCollections(state),
  };
};

const perform = (dispatch) => ({
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
  fetchSubCount: (claimId) => dispatch(doFetchSubCount(claimId)),
});

export default connect(select, perform)(ChannelPage);
