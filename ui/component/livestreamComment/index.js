import { connect } from 'react-redux';
import { selectStakedLevelForChannelUri, selectClaimForUri, selectMyClaimIdsRaw } from 'redux/selectors/claims';
import LivestreamComment from './view';

const select = (state, props) => ({
  claim: selectClaimForUri(state, props.uri),
  stakedLevel: selectStakedLevelForChannelUri(state, props.authorUri),
  myChannelIds: selectMyClaimIdsRaw(state),
});

export default connect(select)(LivestreamComment);
