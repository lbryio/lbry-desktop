import { connect } from 'react-redux';

import { selectMyPurchasedMembershipsFromCreators } from 'redux/selectors/memberships';
import { doMembershipMine } from 'redux/actions/memberships';

import PledgesTab from './view';

const select = (state) => ({
  myPurchasedCreatorMemberships: selectMyPurchasedMembershipsFromCreators(state),
});

const perform = {
  doMembershipMine,
};

export default connect(select, perform)(PledgesTab);
