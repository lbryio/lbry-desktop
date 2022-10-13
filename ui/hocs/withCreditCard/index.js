import { connect } from 'react-redux';

import { selectHasSavedCard } from 'redux/selectors/stripe';

import { doOpenModal } from 'redux/actions/app';
import { doGetCustomerStatus } from 'redux/actions/stripe';

import withCreditCard from './view';

const select = (state, props) => ({
  hasSavedCard: selectHasSavedCard(state),
});

const perform = {
  doOpenModal,
  doGetCustomerStatus,
};

export default (Component) => connect(select, perform)(withCreditCard(Component));
