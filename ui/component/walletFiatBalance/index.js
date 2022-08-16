import { connect } from 'react-redux';
import { selectAccountTotals } from 'redux/selectors/stripe';
import { doTipAccountStatus } from 'redux/actions/stripe';
import WalletFiatBalance from './view';

const select = (state) => ({
  accountTotals: selectAccountTotals(state),
});

const perform = {
  doTipAccountStatus,
};

export default connect(select, perform)(WalletFiatBalance);
