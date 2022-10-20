import { connect } from 'react-redux';

import { selectActiveChannelClaim } from 'redux/selectors/app';
import { selectMyChannelClaims } from 'redux/selectors/claims';
import { selectMySupportersList } from 'redux/selectors/memberships';

import { doListAllMyMembershipTiers, doGetMembershipSupportersList } from 'redux/actions/memberships';

import CreatorArea from './view';

const select = (state, props) => ({
  activeChannelClaim: selectActiveChannelClaim(state),
  myChannelClaims: selectMyChannelClaims(state),
  supportersList: selectMySupportersList(state),
});

const perform = {
  doListAllMyMembershipTiers,
  doGetMembershipSupportersList,
};

export default connect(select, perform)(CreatorArea);
