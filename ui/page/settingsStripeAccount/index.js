import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { doTipAccountStatus, doGetAndSetAccountLink } from 'redux/actions/stripe';
import {
  selectAccountStatus,
  selectAccountUnpaidBalance,
  selectAccountChargesEnabled,
  selectAccountRequiresVerification,
  selectAccountLinkResponse,
} from 'redux/selectors/stripe';

import StripeAccountConnection from './view';

const select = (state) => ({
  accountStatus: selectAccountStatus(state),
  unpaidBalance: selectAccountUnpaidBalance(state),
  chargesEnabled: selectAccountChargesEnabled(state),
  accountRequiresVerification: selectAccountRequiresVerification(state),
  accountLinkResponse: selectAccountLinkResponse(state),
});

const perform = {
  doTipAccountStatus,
  doGetAndSetAccountLink,
};

export default withRouter(connect(select, perform)(StripeAccountConnection));
