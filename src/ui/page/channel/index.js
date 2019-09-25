import { connect } from 'react-redux';
import * as settings from 'constants/settings';
import {
  makeSelectClaimIsMine,
  makeSelectTitleForUri,
  makeSelectThumbnailForUri,
  makeSelectCoverForUri,
  selectCurrentChannelPage,
  makeSelectClaimForUri,
  selectChannelIsBlocked,
} from 'lbry-redux';
import { selectBlackListedOutpoints, doFetchSubCount, makeSelectSubCountForUri } from 'lbryinc';
import { makeSelectIsSubscribed } from 'redux/selectors/subscriptions';
import { doOpenModal } from 'redux/actions/app';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import ChannelPage from './view';

const select = (state, props) => ({
  title: makeSelectTitleForUri(props.uri)(state),
  thumbnail: makeSelectThumbnailForUri(props.uri)(state),
  cover: makeSelectCoverForUri(props.uri)(state),
  channelIsMine: makeSelectClaimIsMine(props.uri)(state),
  page: selectCurrentChannelPage(state),
  claim: makeSelectClaimForUri(props.uri)(state),
  isSubscribed: makeSelectIsSubscribed(props.uri, true)(state),
  channelIsBlocked: selectChannelIsBlocked(props.uri)(state),
  blackListedOutpoints: selectBlackListedOutpoints(state),
  supportOption: makeSelectClientSetting(settings.SUPPORT_OPTION)(state),
  subCount: makeSelectSubCountForUri(props.uri)(state),
});

const perform = dispatch => ({
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
  fetchSubCount: claimId => dispatch(doFetchSubCount(claimId)),
});

export default connect(
  select,
  perform
)(ChannelPage);
