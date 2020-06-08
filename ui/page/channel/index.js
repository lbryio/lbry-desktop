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
  showMature: makeSelectClientSetting(settings.SHOW_MATURE)(state),
  subCount: makeSelectSubCountForUri(props.uri)(state),
});

const perform = dispatch => ({
  fetchSubCount: claimId => dispatch(doFetchSubCount(claimId)),
});

export default connect(select, perform)(ChannelPage);
