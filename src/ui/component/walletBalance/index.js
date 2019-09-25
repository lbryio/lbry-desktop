import { connect } from 'react-redux';
import {
  selectBalance,
  selectTotalBalance,
  selectClaimsBalance,
  selectSupportsBalance,
  selectTipsBalance,
} from 'lbry-redux';
import WalletBalance from './view';

const select = state => ({
  balance: selectBalance(state),
  totalBalance: selectTotalBalance(state),
  claimsBalance: selectClaimsBalance(state),
  supportsBalance: selectSupportsBalance(state),
  tipsBalance: selectTipsBalance(state),
});

export default connect(
  select,
  null
)(WalletBalance);
