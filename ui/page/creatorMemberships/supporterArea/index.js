import { connect } from 'react-redux';
import SupporterArea from './view';
import { selectActiveChannelClaim } from 'redux/selectors/app';
import { selectAccountChargesEnabled } from 'redux/selectors/stripe';
import { doTipAccountStatus } from 'redux/actions/stripe';
import { selectMyChannelClaims } from 'redux/selectors/claims';
import { doListAllMyMembershipTiers } from 'redux/actions/memberships';

const select = (state, props) => ({
  bankAccountConfirmed: selectAccountChargesEnabled(state),
  activeChannelClaim: selectActiveChannelClaim(state),
  myChannelClaims: selectMyChannelClaims(state),
});

const perform = {
  doTipAccountStatus,
  doListAllMyMembershipTiers,
};

export default connect(select, perform)(SupporterArea);
