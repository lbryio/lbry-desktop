import { connect } from 'react-redux';
import { makeSelectStakedLevelForChannelUri, selectClaimForUri } from 'redux/selectors/claims';
import LivestreamComment from './view';

const select = (state, props) => ({
  claim: selectClaimForUri(state, props.uri),
  stakedLevel: makeSelectStakedLevelForChannelUri(props.authorUri)(state),
});

export default connect(select)(LivestreamComment);
