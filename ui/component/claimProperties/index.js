import { connect } from 'react-redux';
import { selectClaimIsMine, selectClaimForUri } from 'redux/selectors/claims';
import { makeSelectIsSubscribed } from 'redux/selectors/subscriptions';
import ClaimProperties from './view';

const select = (state, props) => {
  const claim = selectClaimForUri(state, props.uri);

  return {
    claim,
    isSubscribed: makeSelectIsSubscribed(props.uri)(state),
    claimIsMine: selectClaimIsMine(state, claim),
  };
};

export default connect(select, null)(ClaimProperties);
