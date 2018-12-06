import { connect } from 'react-redux';
import { selectBalance } from 'lbry-redux';
import { doOpenModal } from 'redux/actions/app';
import WalletSend from './view';

const perform = dispatch => ({
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
});

const select = state => ({
  balance: selectBalance(state),
});

export default connect(
  select,
  perform
)(WalletSend);
