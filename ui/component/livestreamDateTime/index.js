import { connect } from 'react-redux';
import { makeSelectClaimForUri } from 'redux/selectors/claims';
import { selectActiveLivestreamForClaimId } from 'redux/selectors/livestream';
import LivestreamDateTime from './view';

const select = (state, props) => {
  const claim = props.uri && makeSelectClaimForUri(props.uri)(state);
  return {
    claim,
    activeLivestream: selectActiveLivestreamForClaimId(state, claim?.claim_id),
  };
};

export default connect(select)(LivestreamDateTime);
