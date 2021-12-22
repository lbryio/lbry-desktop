import { connect } from 'react-redux';
import { makeSelectClaimForUri } from 'redux/selectors/claims';
import LivestreamDateTime from './view';
import { selectActiveLivestreamForUri } from 'redux/selectors/livestream';

const select = (state, props) => {
  const claim = props.uri && makeSelectClaimForUri(props.uri)(state);
  return {
    claim,
    activeLivestream: selectActiveLivestreamForUri(state, props.uri),
  };
};

export default connect(select)(LivestreamDateTime);
