import { connect } from 'react-redux';
import {
  selectClaimIsMine,
  selectTitleForUri,
  getThumbnailFromClaim,
  makeSelectCoverForUri,
  selectCurrentChannelPage,
  selectClaimForUri,
  makeSelectClaimIsPending,
} from 'redux/selectors/claims';
import { selectMyUnpublishedCollections } from 'redux/selectors/collections';
import { doFetchSubCount, selectSubCountForUri } from 'lbryinc'; // ban state
import { selectYoutubeChannels } from 'redux/selectors/user';
import { selectIsSubscribedForUri } from 'redux/selectors/subscriptions';
import { selectModerationBlockList } from 'redux/selectors/comments';
import { doOpenModal } from 'redux/actions/app';
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
    blackListedOutpoints: [],
    subCount: selectSubCountForUri(state, props.uri),
    pending: makeSelectClaimIsPending(props.uri)(state),
    youtubeChannels: selectYoutubeChannels(state),
    blockedChannels: selectModerationBlockList(state), // banlist
    mutedChannels: [],
    unpublishedCollections: selectMyUnpublishedCollections(state),
  };
};

const perform = (dispatch) => ({
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
  fetchSubCount: (claimId) => dispatch(doFetchSubCount(claimId)),
});

export default connect(select, perform)(ChannelPage);
