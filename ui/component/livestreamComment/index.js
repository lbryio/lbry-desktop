import { connect } from 'react-redux';
import { makeSelectStakedLevelForChannelUri, selectClaimForUri, selectMyChannelClaims } from 'redux/selectors/claims';
import LivestreamComment from './view';

const select = (state, props) => ({
  claim: selectClaimForUri(state, props.uri),
  stakedLevel: makeSelectStakedLevelForChannelUri(props.authorUri)(state),
  myChannels: selectMyChannelClaims(state),
});

export default connect(select)(LivestreamComment);
