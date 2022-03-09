import { connect } from 'react-redux';
import { selectClaimForUri, selectIsUriResolving, selectOdyseeMembershipForUri } from 'redux/selectors/claims';
import WunderbarSuggestion from './view';

const select = (state, props) => {
  const { uri } = props;

  return {
    claim: selectClaimForUri(state, uri),
    isResolvingUri: selectIsUriResolving(state, uri),
    odyseeMembershipByUri: selectOdyseeMembershipForUri(state, uri),
  };
};

export default connect(select)(WunderbarSuggestion);
