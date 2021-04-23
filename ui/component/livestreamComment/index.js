import { connect } from 'react-redux';
import { makeSelectStakedLevelForChannelUri, makeSelectClaimForUri } from 'lbry-redux';
import LivestreamComment from './view';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  stakedLevel: makeSelectStakedLevelForChannelUri(props.authorUri)(state),
});

export default connect(select)(LivestreamComment);
