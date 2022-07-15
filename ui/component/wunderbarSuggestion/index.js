import { connect } from 'react-redux';
import { selectClaimForUri, selectGeoRestrictionForUri, selectIsUriResolving } from 'redux/selectors/claims';
import WunderbarSuggestion from './view';

const select = (state, props) => {
  const { uri } = props;

  return {
    claim: selectClaimForUri(state, uri),
    isResolvingUri: selectIsUriResolving(state, uri),
    geoRestriction: selectGeoRestrictionForUri(state, props.uri),
  };
};

export default connect(select)(WunderbarSuggestion);
