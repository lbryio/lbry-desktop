import { connect } from 'react-redux';
import { doHideModal } from 'redux/actions/app';
import ModalRemoveBtcSwapAddress from './view';
import { doRemoveBtcAddress } from 'redux/actions/coinSwap';

const select = (state, props) => ({});

const perform = (dispatch) => ({
  doRemoveBtcAddress: (btcAddress) => dispatch(doRemoveBtcAddress(btcAddress)),
  closeModal: () => dispatch(doHideModal()),
});

export default connect(select, perform)(ModalRemoveBtcSwapAddress);
