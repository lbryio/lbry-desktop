import { connect } from 'react-redux';

import { selectMyChannelClaims } from 'redux/selectors/claims';
import { selectMyTotalSupportersAmount, selectMyTotalMonthlyIncome } from 'redux/selectors/memberships';
import { doSetActiveChannel } from 'redux/actions/app';

import OverviewTab from './view';

const select = (state, props) => ({
  myChannelClaims: selectMyChannelClaims(state),
  totalSupportersAmount: selectMyTotalSupportersAmount(state),
  totalMonthlyIncome: selectMyTotalMonthlyIncome(state),
});

const perform = {
  doSetActiveChannel,
};

export default connect(select, perform)(OverviewTab);
