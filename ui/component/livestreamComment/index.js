import { connect } from 'react-redux';
import { makeSelectStakedLevelForChannelUri, makeSelectClaimForUri } from 'redux/selectors/claims';
import LivestreamComment from './view';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  stakedLevel: makeSelectStakedLevelForChannelUri(props.authorUri)(state),
});

export default connect(select)(LivestreamComment);
