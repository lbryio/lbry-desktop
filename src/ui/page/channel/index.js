import { connect } from 'react-redux';
import {
  makeSelectClaimIsMine,
  makeSelectTitleForUri,
  makeSelectThumbnailForUri,
  makeSelectCoverForUri,
  selectCurrentChannelPage,
} from 'lbry-redux';
import ChannelPage from './view';

const select = (state, props) => ({
  page: selectCurrentChannelPage(state),
  cover: makeSelectCoverForUri(props.uri)(state),
  title: makeSelectTitleForUri(props.uri)(state),
  thumbnail: makeSelectThumbnailForUri(props.uri)(state),
  channelIsMine: makeSelectClaimIsMine(props.uri)(state),
});

export default connect(
  select,
  null
)(ChannelPage);
