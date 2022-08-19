import { connect } from 'react-redux';
import { selectAccountStatus } from 'redux/selectors/stripe';
import { doTipAccountStatus } from 'redux/actions/stripe';
import WalletFiatBalance from './view';

const select = (state) => ({
  accountStatus: selectAccountStatus(state),
});

const perform = {
  doTipAccountStatus,
};

export default connect(select, perform)(WalletFiatBalance);
