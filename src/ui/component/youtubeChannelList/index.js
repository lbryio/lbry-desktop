import { connect } from 'react-redux';
// fetchUserInfo
import { selectYoutubeChannels } from 'lbryinc';

import YoutubeChannelList from './view';

const select = state => ({
  ytChannels: selectYoutubeChannels(state),
});

// const perform = dispatch => ({
//   claimChannels: () => dispatch(doTransfer)
// });

/*

 */

export default connect(
  select,
  null
)(YoutubeChannelList);
