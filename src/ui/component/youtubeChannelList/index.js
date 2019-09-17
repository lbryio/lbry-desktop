import { connect } from 'react-redux';
import {
  selectYoutubeChannels,
  selectYTImportPending,
  selectUserIsPending,
  doClaimYoutubeChannels,
  doUserFetch,
} from 'lbryinc';

import YoutubeChannelList from './view';

const select = state => ({
  ytChannels: selectYoutubeChannels(state),
  ytImportPending: selectYTImportPending(state),
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
