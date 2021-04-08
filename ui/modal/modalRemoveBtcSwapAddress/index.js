import { connect } from 'react-redux';
import { doHideModal } from 'redux/actions/app';
import ModalRemoveBtcSwapAddress from './view';
import { doRemoveCoinSwap } from 'redux/actions/coinSwap';

const select = (state, props) => ({});

const perform = (dispatch) => ({
  removeCoinSwap: (chargeCode) => dispatch(doRemoveCoinSwap(chargeCode)),
  closeModal: () => dispatch(doHideModal()),
});

export default connect(select, perform)(ModalRemoveBtcSwapAddress);
