import { connect } from 'react-redux';
import { makeSelectClaimForUri } from 'lbry-redux';
import ChannelStakedIndicator from './view';

const select = (state, props) => ({
  channelClaim: makeSelectClaimForUri(props.uri)(state),
});

export default connect(select)(ChannelStakedIndicator);
