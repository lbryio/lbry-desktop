import { connect } from 'react-redux';
import { selectBlockedChannels, selectChannelIsBlocked, doToggleBlockChannel } from 'lbry-redux';
import BlockButton from './view';

const select = (state, props) => ({
  channelIsBlocked: selectChannelIsBlocked(props.uri)(state),
  blockedChannels: selectBlockedChannels(state),
});

export default connect(
  select,
  {
    toggleBlockChannel: doToggleBlockChannel,
  }
)(BlockButton);
