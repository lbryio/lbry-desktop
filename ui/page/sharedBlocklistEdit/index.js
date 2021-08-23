import { connect } from 'react-redux';
import { doSblUpdate } from 'redux/actions/comments';
import { doToast } from 'redux/actions/notifications';
import { selectActiveChannelClaim } from 'redux/selectors/app';

import SharedBlocklistEdit from './view';

const select = (state) => ({
  activeChannelClaim: selectActiveChannelClaim(state),
});

const perform = (dispatch) => ({
  doSblUpdate: (channelClaim, params, onComplete) => dispatch(doSblUpdate(channelClaim, params, onComplete)),
  doToast: (options) => dispatch(doToast(options)),
});

export default connect(select, perform)(SharedBlocklistEdit);
