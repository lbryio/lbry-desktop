import { connect } from 'react-redux';
import {
  selectYoutubeChannels,
  selectYouTubeImportPending,
  selectUserIsPending,
  doClaimYoutubeChannels,
  doUserFetch,
} from 'lbryinc';
import YoutubeChannelList from './view';

const select = state => ({
  youtubeChannels: selectYoutubeChannels(state),
  youtubeImportPending: selectYouTubeImportPending(state),
  userFetchPending: selectUserIsPending(state),
});

const perform = dispatch => ({
  claimChannels: () => dispatch(doClaimYoutubeChannels()),
  updateUser: () => dispatch(doUserFetch()),
});

export default connect(
  select,
  perform
)(YoutubeChannelList);
