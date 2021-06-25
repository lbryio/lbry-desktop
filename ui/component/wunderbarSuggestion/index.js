import { connect } from 'react-redux';
import { makeSelectClaimForUri, makeSelectIsUriResolving } from 'lbry-redux';
import WunderbarSuggestion from './view';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  isResolvingUri: makeSelectIsUriResolving(props.uri)(state),
});

export default connect(select)(WunderbarSuggestion);
