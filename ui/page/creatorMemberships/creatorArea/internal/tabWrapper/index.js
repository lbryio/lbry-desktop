import { connect } from 'react-redux';

import { selectAccountChargesEnabled, selectAccountDefaultCurrency } from 'redux/selectors/stripe';
import { selectMyChannelClaims } from 'redux/selectors/claims';
import { userHasMembershipTiers, selectMySupportersList } from 'redux/selectors/memberships';

import { doTipAccountStatus } from 'redux/actions/stripe';

import TabWrapper from './view';

const select = (state, props) => ({
  myChannelClaims: selectMyChannelClaims(state),
  bankAccountConfirmed: selectAccountChargesEnabled(state),
  accountDefaultCurrency: selectAccountDefaultCurrency(state),
  hasTiers: userHasMembershipTiers(state),
  supportersList: selectMySupportersList(state),
});

const perform = {
  doTipAccountStatus,
};

export default connect(select, perform)(TabWrapper);
