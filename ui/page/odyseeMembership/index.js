import { connect } from 'react-redux';
import { doOpenModal } from 'redux/actions/app';
import OdyseeMembership from './view';
import { selectActiveChannelClaim, selectIncognito } from 'redux/selectors/app';
import { selectMyChannelClaims, selectClaimsByUri } from 'redux/selectors/claims';
import { doFetchUserMemberships, doCheckUserOdyseeMemberships } from 'redux/actions/user';
import { selectClientSetting } from 'redux/selectors/settings';
import { selectUser, selectUserLocale } from 'redux/selectors/user';
import * as SETTINGS from 'constants/settings';

const select = (state) => {
  const activeChannelClaim = selectActiveChannelClaim(state);

  return {
    activeChannelClaim,
    channels: selectMyChannelClaims(state),
    claimsByUri: selectClaimsByUri(state),
    incognito: selectIncognito(state),
    user: selectUser(state),
    locale: selectUserLocale(state),
    preferredCurrency: selectClientSetting(state, SETTINGS.PREFERRED_CURRENCY),
  };
};

const perform = (dispatch) => ({
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
  fetchUserMemberships: (claimIds) => dispatch(doFetchUserMemberships(claimIds)),
  updateUserOdyseeMembershipStatus: (user) => dispatch(doCheckUserOdyseeMemberships(user)),
});

export default connect(select, perform)(OdyseeMembership);
