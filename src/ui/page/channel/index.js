import { connect } from 'react-redux';
import {
  makeSelectClaimIsMine,
  makeSelectTitleForUri,
  makeSelectThumbnailForUri,
  makeSelectCoverForUri,
  selectCurrentChannelPage,
  makeSelectClaimForUri,
  selectChannelIsBlocked,
} from 'lbry-redux';
import { makeSelectIsSubscribed } from 'redux/selectors/subscriptions';
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
});

export default connect(
  select,
  null
)(ChannelPage);
