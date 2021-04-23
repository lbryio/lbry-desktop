import { connect } from 'react-redux';
import { selectBalance } from 'lbry-redux';
import WalletTipAmountSelector from './view';

const select = (state, props) => ({
  balance: selectBalance(state),
});

export default connect(select)(WalletTipAmountSelector);
