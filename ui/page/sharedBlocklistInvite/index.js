import { connect } from 'react-redux';
import { doSblInvite } from 'redux/actions/comments';
import { doToast } from 'redux/actions/notifications';
import { selectActiveChannelClaim } from 'redux/selectors/app';

import SharedBlocklistInvite from './view';

const select = (state) => ({
  activeChannelClaim: selectActiveChannelClaim(state),
});

const perform = (dispatch) => ({
  doSblInvite: (channelClaim, paramList, onComplete) => dispatch(doSblInvite(channelClaim, paramList, onComplete)),
  doToast: (options) => dispatch(doToast(options)),
});

export default connect(select, perform)(SharedBlocklistInvite);
