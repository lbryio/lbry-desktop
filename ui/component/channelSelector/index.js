import { connect } from 'react-redux';
import { selectMyChannelClaims, makeSelectClaimForUri } from 'lbry-redux';
import { selectActiveChannelClaim, selectIncognito } from 'redux/selectors/app';
import { doSetActiveChannel, doSetIncognito } from 'redux/actions/app';
import SelectChannel from './view';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  channels: selectMyChannelClaims(state),
  activeChannelClaim: selectActiveChannelClaim(state),
  incognito: selectIncognito(state),
});

export default connect(select, {
  doSetActiveChannel,
  doSetIncognito,
})(SelectChannel);
