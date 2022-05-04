import { connect } from 'react-redux';
import * as SETTINGS from 'constants/settings';
import SelectChannel from './view';
import { selectMyChannelClaims, selectFetchingMyChannels } from 'redux/selectors/claims';
import { selectActiveChannelClaim } from 'redux/selectors/app';
import { doSetActiveChannel } from 'redux/actions/app';
import { selectClientSetting } from 'redux/selectors/settings';

const select = (state) => ({
  myChannelClaims: selectMyChannelClaims(state),
  fetchingChannels: selectFetchingMyChannels(state),
  activeChannelClaimId: selectActiveChannelClaim(state)?.claim_id,
  hasDefaultChannel: Boolean(selectClientSetting(state, SETTINGS.ACTIVE_CHANNEL_CLAIM)),
});

const perform = (dispatch) => ({
  setActiveChannel: (claimId, override) => dispatch(doSetActiveChannel(claimId, override)),
});

export default connect(select, perform)(SelectChannel);
