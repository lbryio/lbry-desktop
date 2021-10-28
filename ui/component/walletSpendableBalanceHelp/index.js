import { connect } from 'react-redux';
import { selectBalance } from 'redux/selectors/wallet';
import WalletSpendableBalanceHelp from './view';

const select = (state) => ({ balance: selectBalance(state) });

export default connect(select)(WalletSpendableBalanceHelp);
