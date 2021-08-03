import { connect } from 'react-redux';
import { makeSelectClaimIsMine, makeSelectClaimForUri } from 'lbry-redux';
import { makeSelectIsSubscribed } from 'redux/selectors/subscriptions';
import ClaimProperties from './view';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  isSubscribed: makeSelectIsSubscribed(props.uri)(state),
  claimIsMine: makeSelectClaimIsMine(props.uri)(state),
});

export default connect(select, null)(ClaimProperties);
