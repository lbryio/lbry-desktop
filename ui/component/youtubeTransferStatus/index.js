import { connect } from 'react-redux';
import {
  selectYoutubeChannels,
  selectYouTubeImportPending,
  selectUserIsPending,
  doClaimYoutubeChannels,
  doUserFetch,
  selectYouTubeImportVideosComplete,
  doCheckYoutubeTransfer,
} from 'lbryinc';
import YoutubeChannelList from './view';

const select = state => ({
  youtubeChannels: selectYoutubeChannels(state),
  youtubeImportPending: selectYouTubeImportPending(state),
  userFetchPending: selectUserIsPending(state),
  videosImported: selectYouTubeImportVideosComplete(state),
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
