import { connect } from 'react-redux';
import { makeSelectClaimForUri } from 'redux/selectors/claims';
import LivestreamLink from './view';

const select = (state, props) => ({
  channelClaim: makeSelectClaimForUri(props.uri)(state),
});

export default connect(select)(LivestreamLink);
