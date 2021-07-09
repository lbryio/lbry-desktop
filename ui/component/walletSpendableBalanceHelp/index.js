import { connect } from 'react-redux';
import { selectBalance } from 'lbry-redux';
import WalletSpendableBalanceHelp from './view';

const select = (state, props) => ({
  balance: selectBalance(state),
});

export default connect(select)(WalletSpendableBalanceHelp);
