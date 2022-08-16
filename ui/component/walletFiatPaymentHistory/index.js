import { connect } from 'react-redux';
import { doGetCustomerStatus } from 'redux/actions/stripe';
import { selectLastFour } from 'redux/selectors/stripe';
import WalletFiatPaymentHistory from './view';

const select = (state) => ({
  lastFour: selectLastFour(state),
});

const perform = {
  doGetCustomerStatus,
};

export default connect(select, perform)(WalletFiatPaymentHistory);
