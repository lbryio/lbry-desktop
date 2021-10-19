import { connect } from 'react-redux';
import { selectMyChannelClaims } from 'redux/selectors/claims';
import { selectActiveChannelClaim, selectIncognito } from 'redux/selectors/app';
import { doSetActiveChannel, doSetIncognito } from 'redux/actions/app';
import ChannelSelector from './view';

const select = (state) => ({
  channels: selectMyChannelClaims(state),
  activeChannelClaim: selectActiveChannelClaim(state),
  incognito: selectIncognito(state),
});

export default connect(select, {
  doSetActiveChannel,
  doSetIncognito,
})(ChannelSelector);
