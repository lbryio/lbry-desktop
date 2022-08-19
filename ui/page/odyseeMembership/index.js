import { connect } from 'react-redux';
import { doOpenModal } from 'redux/actions/app';
import OdyseeMembership from './view';
import { selectActiveChannelClaim, selectIncognito } from 'redux/selectors/app';
import { selectMyChannelClaims, selectClaimsByUri } from 'redux/selectors/claims';
import { doFetchUserMemberships, doCheckUserOdyseeMemberships } from 'redux/actions/user';
import { selectPreferredCurrency } from 'redux/selectors/settings';
import { selectUser, selectUserLocale } from 'redux/selectors/user';
import { selectHasSavedCard } from 'redux/selectors/stripe';
import { doGetCustomerStatus } from 'redux/actions/stripe';

const select = (state) => {
  const activeChannelClaim = selectActiveChannelClaim(state);

  return {
    activeChannelClaim,
    channels: selectMyChannelClaims(state),
    claimsByUri: selectClaimsByUri(state),
    incognito: selectIncognito(state),
    user: selectUser(state),
    locale: selectUserLocale(state),
    preferredCurrency: selectPreferredCurrency(state),
    hasSavedCard: selectHasSavedCard(state),
  };
};

const perform = (dispatch) => ({
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
  fetchUserMemberships: (claimIds) => dispatch(doFetchUserMemberships(claimIds)),
  updateUserOdyseeMembershipStatus: (user) => dispatch(doCheckUserOdyseeMemberships(user)),
  doGetCustomerStatus: () => dispatch(doGetCustomerStatus()),
});

export default connect(select, perform)(OdyseeMembership);
