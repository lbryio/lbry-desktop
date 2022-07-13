import { connect } from 'react-redux';
import { selectClaimForUri } from 'redux/selectors/claims';
import ClaimDescription from './view';
import { getClaimMetadata } from 'util/claim';

const select = (state, props) => {
  const { uri, description: descriptionProp } = props;

  const claim = !descriptionProp && selectClaimForUri(state, uri);
  const metadata = claim && getClaimMetadata(claim);

  return {
    description: descriptionProp || (metadata && metadata.description),
  };
};

export default connect(select)(ClaimDescription);
