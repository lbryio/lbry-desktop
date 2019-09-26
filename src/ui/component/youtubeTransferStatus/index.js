import { connect } from 'react-redux';
import {
  selectYoutubeChannels,
  selectYTImportPending,
  selectUserIsPending,
  doClaimYoutubeChannels,
  doUserFetch,
  selectYTImportVideosComplete,
  doCheckYoutubeTransfer,
} from 'lbryinc';
import YoutubeChannelList from './view';

const select = state => ({
  youtubeChannels: selectYoutubeChannels(state),
  ytImportPending: selectYTImportPending(state),
  userFetchPending: selectUserIsPending(state),
  videosImported: selectYTImportVideosComplete(state),
});

const perform = dispatch => ({
  claimChannels: () => dispatch(doClaimYoutubeChannels()),
  updateUser: () => dispatch(doUserFetch()),
  checkYoutubeTransfer: () => dispatch(doCheckYoutubeTransfer()),
});

export default connect(
  select,
  perform
)(YoutubeChannelList);
