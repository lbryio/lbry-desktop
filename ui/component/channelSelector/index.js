import { connect } from 'react-redux';
import { selectMyChannelClaims, selectClaimsByUri } from 'redux/selectors/claims';
import { selectActiveChannelClaim, selectIncognito } from 'redux/selectors/app';
import { doSetActiveChannel, doSetIncognito } from 'redux/actions/app';
import { doFetchUserMemberships } from 'redux/actions/user';
import { doSetDefaultChannel } from 'redux/actions/settings';
import { selectDefaultChannelClaim } from 'redux/selectors/settings';
import ChannelSelector from './view';

const select = (state, props) => {
  const { storeSelection } = props;
  const activeChannelClaim = selectActiveChannelClaim(state);
  const defaultChannelClaim = selectDefaultChannelClaim(state);

  return {
    channels: selectMyChannelClaims(state),
    activeChannelClaim: storeSelection ? defaultChannelClaim : activeChannelClaim,
    incognito: selectIncognito(state),
    claimsByUri: selectClaimsByUri(state),
  };
};

const perform = {
  doSetActiveChannel,
  doSetIncognito,
  doFetchUserMemberships,
  doSetDefaultChannel,
};

export default connect(select, perform)(ChannelSelector);
