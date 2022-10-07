import { connect } from 'react-redux';

import { selectActiveChannelClaim } from 'redux/selectors/app';
import { selectAccountChargesEnabled } from 'redux/selectors/stripe';
import { selectMyChannelClaims } from 'redux/selectors/claims';
import { selectMySupportersList } from 'redux/selectors/memberships';

import { doTipAccountStatus } from 'redux/actions/stripe';
import { doListAllMyMembershipTiers, doGetMembershipSupportersList } from 'redux/actions/memberships';

import CreatorArea from './view';

const select = (state, props) => ({
  bankAccountConfirmed: selectAccountChargesEnabled(state),
  activeChannelClaim: selectActiveChannelClaim(state),
  myChannelClaims: selectMyChannelClaims(state),
  supportersList: selectMySupportersList(state),
});

const perform = {
  doTipAccountStatus,
  doListAllMyMembershipTiers,
  doGetMembershipSupportersList,
};

export default connect(select, perform)(CreatorArea);
