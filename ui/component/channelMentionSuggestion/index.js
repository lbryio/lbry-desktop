import { connect } from 'react-redux';
import { makeSelectClaimForUri, makeSelectIsUriResolving } from 'redux/selectors/claims';
import ChannelMentionSuggestion from './view';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  isResolvingUri: makeSelectIsUriResolving(props.uri)(state),
});

export default connect(select)(ChannelMentionSuggestion);
