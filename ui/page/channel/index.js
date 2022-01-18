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
import { selectBlacklistedOutpointMap, doFetchSubCount, selectSubCountForUri } from 'lbryinc';
import { selectYoutubeChannels } from 'redux/selectors/user';
import { selectIsSubscribedForUri } from 'redux/selectors/subscriptions';
import { selectModerationBlockList } from 'redux/selectors/comments';
import { selectMutedChannels } from 'redux/selectors/blocked';
import { doOpenModal } from 'redux/actions/app';
import { selectLanguage } from 'redux/selectors/settings';
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
  };
};

const perform = (dispatch) => ({
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
  fetchSubCount: (claimId) => dispatch(doFetchSubCount(claimId)),
});

export default connect(select, perform)(ChannelPage);
