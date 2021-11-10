import { connect } from 'react-redux';
import { selectClaimIsMineForUri, makeSelectClaimForUri } from 'redux/selectors/claims';
import { makeSelectIsSubscribed } from 'redux/selectors/subscriptions';
import ClaimProperties from './view';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  isSubscribed: makeSelectIsSubscribed(props.uri)(state),
  claimIsMine: selectClaimIsMineForUri(state, props.uri),
});

export default connect(select, null)(ClaimProperties);
