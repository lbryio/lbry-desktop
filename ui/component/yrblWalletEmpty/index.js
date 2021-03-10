import { connect } from 'react-redux';
import { selectBalance } from 'lbry-redux';
import Wallet from './view';

const select = (state) => ({
  balance: selectBalance(state),
});

export default connect(select, {})(Wallet);
