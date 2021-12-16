import { connect } from 'react-redux';
import { selectStakedLevelForChannelUri, selectClaimForUri } from 'redux/selectors/claims';
import LivestreamComment from './view';

const select = (state, props) => ({
  claim: selectClaimForUri(state, props.uri),
  stakedLevel: selectStakedLevelForChannelUri(state, props.authorUri),
});

export default connect(select)(LivestreamComment);
