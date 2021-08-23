import { connect } from 'react-redux';
import { doOpenModal } from 'redux/actions/app';
import { doSblGet, doSblAccept, doSblListInvites, doSblRescind, doSblDelete } from 'redux/actions/comments';
import { doToast } from 'redux/actions/notifications';
import { selectActiveChannelClaim } from 'redux/selectors/app';
import {
  selectSblMine,
  selectFetchingSblMine,
  selectFetchingSblInvited,
  selectSblInvited,
} from 'redux/selectors/comments';

import BlockListShared from './view';

const select = (state) => ({
  activeChannelClaim: selectActiveChannelClaim(state),
  sblMine: selectSblMine(state),
  sblInvited: selectSblInvited(state),
  fetchingSblMine: selectFetchingSblMine(state),
  fetchingSblInvited: selectFetchingSblInvited(state),
});

const perform = (dispatch) => ({
  doSblGet: (channelClaim, params) => dispatch(doSblGet(channelClaim, params)),
  doSblListInvites: (channelClaim) => dispatch(doSblListInvites(channelClaim)),
  doSblAccept: (channelClaim, params, onComplete) => dispatch(doSblAccept(channelClaim, params, onComplete)),
  doSblRescind: (channelClaim, params, onComplete) => dispatch(doSblRescind(channelClaim, params, onComplete)),
  doSblDelete: (channelClaim) => dispatch(doSblDelete(channelClaim)),
  doOpenModal: (modal, props) => dispatch(doOpenModal(modal, props)),
  doToast: (options) => dispatch(doToast(options)),
});

export default connect(select, perform)(BlockListShared);
