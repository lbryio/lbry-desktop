import { connect } from 'react-redux';
import { selectBalance } from 'lbry-redux';
import { doOpenModal } from 'redux/actions/app';
import Wallet from './view';

const select = state => ({
  balance: selectBalance(state),
});

export default connect(select, {
  doOpenModal,
})(Wallet);
