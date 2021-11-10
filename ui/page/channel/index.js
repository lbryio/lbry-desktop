import { connect } from 'react-redux';
import {
  selectClaimIsMineForUri,
  makeSelectTitleForUri,
  makeSelectThumbnailForUri,
  makeSelectCoverForUri,
  selectCurrentChannelPage,
  makeSelectClaimForUri,
  makeSelectClaimIsPending,
} from 'redux/selectors/claims';
import { selectMyUnpublishedCollections } from 'redux/selectors/collections';
import { selectBlackListedOutpoints, doFetchSubCount, makeSelectSubCountForUri } from 'lbryinc';
import { selectYoutubeChannels } from 'redux/selectors/user';
import { makeSelectIsSubscribed } from 'redux/selectors/subscriptions';
import { selectModerationBlockList } from 'redux/selectors/comments';
import { selectMutedChannels } from 'redux/selectors/blocked';
import { doOpenModal } from 'redux/actions/app';
import ChannelPage from './view';

const select = (state, props) => ({
  title: makeSelectTitleForUri(props.uri)(state),
  thumbnail: makeSelectThumbnailForUri(props.uri)(state),
  cover: makeSelectCoverForUri(props.uri)(state),
  channelIsMine: selectClaimIsMineForUri(state, props.uri),
  page: selectCurrentChannelPage(state),
  claim: makeSelectClaimForUri(props.uri)(state),
  isSubscribed: makeSelectIsSubscribed(props.uri, true)(state),
  blackListedOutpoints: selectBlackListedOutpoints(state),
  subCount: makeSelectSubCountForUri(props.uri)(state),
  pending: makeSelectClaimIsPending(props.uri)(state),
  youtubeChannels: selectYoutubeChannels(state),
  blockedChannels: selectModerationBlockList(state),
  mutedChannels: selectMutedChannels(state),
  unpublishedCollections: selectMyUnpublishedCollections(state),
});

const perform = (dispatch) => ({
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
  fetchSubCount: (claimId) => dispatch(doFetchSubCount(claimId)),
});

export default connect(select, perform)(ChannelPage);
