import { connect } from 'react-redux';
import {
  selectClaimForUri,
  selectGeoRestrictionForUri,
  selectIsUriResolving,
  selectOdyseeMembershipForUri,
} from 'redux/selectors/claims';
import WunderbarSuggestion from './view';

const select = (state, props) => {
  const { uri } = props;

  return {
    claim: selectClaimForUri(state, uri),
    isResolvingUri: selectIsUriResolving(state, uri),
    geoRestriction: selectGeoRestrictionForUri(state, props.uri),
    odyseeMembership: selectOdyseeMembershipForUri(state, uri),
  };
};

export default connect(select)(WunderbarSuggestion);
