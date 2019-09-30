import { connect } from 'react-redux';
import {
  selectBalance,
  selectTotalBalance,
  selectClaimsBalance,
  selectSupportsBalance,
  selectTipsBalance,
} from 'lbry-redux';
import { selectClaimedRewards } from 'lbryinc';
import WalletBalance from './view';

const select = state => ({
  balance: selectBalance(state),
  totalBalance: selectTotalBalance(state),
  claimsBalance: selectClaimsBalance(state) || 0,
  supportsBalance: selectSupportsBalance(state) || 0,
  tipsBalance: selectTipsBalance(state) || 0,
  rewards: selectClaimedRewards(state),
});

export default connect(select)(WalletBalance);
