import { connect } from 'react-redux';
import { selectClaimIsMine, selectClaimForUri } from 'redux/selectors/claims';
import { selectIsSubscribedForUri } from 'redux/selectors/subscriptions';
import ClaimProperties from './view';

const select = (state, props) => {
  const claim = selectClaimForUri(state, props.uri);

  return {
    claim,
    isSubscribed: selectIsSubscribedForUri(state, props.uri),
    claimIsMine: selectClaimIsMine(state, claim),
  };
};

export default connect(select, null)(ClaimProperties);
