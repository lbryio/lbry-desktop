import { connect } from 'react-redux';
import { selectTotalBalance } from 'lbry-redux';
import { doOpenModal } from 'redux/actions/app';
import Wallet from './view';

const select = state => ({
  totalBalance: selectTotalBalance(state),
});

export default connect(select, {
  doOpenModal,
})(Wallet);
