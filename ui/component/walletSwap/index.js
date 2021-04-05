import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import WalletSwap from './view';
import { doOpenModal } from 'redux/actions/app';
import { doAddCoinSwap } from 'redux/actions/coinSwap';
import { doToast } from 'redux/actions/notifications';
import { selectCoinSwaps } from 'redux/selectors/coinSwap';
import { selectUserVerifiedEmail } from 'redux/selectors/user';
import { selectReceiveAddress, doGetNewAddress, doCheckAddressIsMine } from 'lbry-redux';

const select = (state, props) => ({
  receiveAddress: selectReceiveAddress(state),
  coinSwaps: selectCoinSwaps(state),
  isAuthenticated: selectUserVerifiedEmail(state),
});

const perform = (dispatch) => ({
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
  doToast: (options) => dispatch(doToast(options)),
  addCoinSwap: (coinSwap) => dispatch(doAddCoinSwap(coinSwap)),
  getNewAddress: () => dispatch(doGetNewAddress()),
  checkAddressIsMine: (address) => dispatch(doCheckAddressIsMine(address)),
});

export default withRouter(connect(select, perform)(WalletSwap));
