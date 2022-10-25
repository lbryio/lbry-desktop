import { connect } from 'react-redux';
import { doSendDraftTransaction, doSendTip } from 'redux/actions/wallet';
import { selectClaimForUri } from 'redux/selectors/claims';
import { doHideModal } from 'redux/actions/app';
import ModalConfirmTransaction from './view';
import { selectActiveChannelClaim, selectIncognito } from 'redux/selectors/app';

const select = (state, props) => ({
  claim: selectClaimForUri(state, props.destination),
  activeChannelClaim: selectActiveChannelClaim(state),
  incognito: selectIncognito(state),
});

const perform = (dispatch) => ({
  closeModal: () => dispatch(doHideModal()),
  sendToAddress: (address, amount) => dispatch(doSendDraftTransaction(address, amount)),
  sendTip: (params, isSupport) => dispatch(doSendTip(params, isSupport)),
});

export default connect(select, perform)(ModalConfirmTransaction);
