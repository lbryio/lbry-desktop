import { connect } from 'react-redux';
import { selectClaimForUri, selectIsUriResolving } from 'redux/selectors/claims';
import TextareaSuggestionsItem from './view';

const select = (state, props) => ({
  claim: props.uri && selectClaimForUri(state, props.uri),
  isResolvingUri: props.uri && selectIsUriResolving(state, props.uri),
});

export default connect(select)(TextareaSuggestionsItem);
