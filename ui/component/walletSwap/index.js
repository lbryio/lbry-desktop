import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import WalletSwap from './view';
import { doOpenModal } from 'redux/actions/app';
import { doAddBtcAddress } from 'redux/actions/coinSwap';
import { doToast } from 'redux/actions/notifications';
import { selectBtcAddresses } from 'redux/selectors/coinSwap';
import { selectReceiveAddress, doGetNewAddress, doCheckAddressIsMine } from 'lbry-redux';

const select = (state, props) => ({
  receiveAddress: selectReceiveAddress(state),
  btcAddresses: selectBtcAddresses(state),
});

const perform = (dispatch) => ({
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
  doToast: (options) => dispatch(doToast(options)),
  doAddBtcAddress: (address) => dispatch(doAddBtcAddress(address)),
  getNewAddress: () => dispatch(doGetNewAddress()),
  checkAddressIsMine: (address) => dispatch(doCheckAddressIsMine(address)),
});

export default withRouter(connect(select, perform)(WalletSwap));
