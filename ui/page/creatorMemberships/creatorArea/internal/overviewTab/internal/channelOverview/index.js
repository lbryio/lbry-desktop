import { connect } from 'react-redux';

import { selectMyChannelClaims } from 'redux/selectors/claims';
import { selectSupportersAmountForChannelId, selectMonthlyIncomeForChannelId } from 'redux/selectors/memberships';

import ChannelOverview from './view';

const select = (state, props) => {
  const { channelClaim } = props;

  return {
    myChannelClaims: selectMyChannelClaims(state),
    supportersAmount: selectSupportersAmountForChannelId(state, channelClaim.claim_id),
    monthlyIncome: selectMonthlyIncomeForChannelId(state, channelClaim.claim_id),
  };
};

export default connect(select)(ChannelOverview);
