import { connect } from 'react-redux';
import { doOpenModal } from 'redux/actions/app';
import { selectPreferredCurrency } from 'redux/selectors/settings';
import { doOpenCancelationModalForMembership } from 'redux/actions/memberships';

import PremiumOption from './view';

const select = (state, props) => ({
  preferredCurrency: selectPreferredCurrency(state),
});

const perform = {
  doOpenModal,
  doOpenCancelationModalForMembership,
};

export default connect(select, perform)(PremiumOption);
