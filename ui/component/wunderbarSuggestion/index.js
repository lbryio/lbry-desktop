import { connect } from 'react-redux';
import { selectClaimForUri, selectIsUriResolving } from 'redux/selectors/claims';
import WunderbarSuggestion from './view';

const select = (state, props) => ({
  claim: selectClaimForUri(state, props.uri),
  isResolvingUri: selectIsUriResolving(state, props.uri),
});

export default connect(select)(WunderbarSuggestion);
