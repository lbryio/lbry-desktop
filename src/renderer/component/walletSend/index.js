import { connect } from 'react-redux';
import { selectBalance, doNotify } from 'lbry-redux';
import WalletSend from './view';

const perform = dispatch => ({
  openModal: (modal, props) => dispatch(doNotify(modal, props)),
});

const select = state => ({
  balance: selectBalance(state),
});

export default connect(select, perform)(WalletSend);
