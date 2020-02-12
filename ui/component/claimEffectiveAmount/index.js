import { connect } from 'react-redux';
import { makeSelectClaimForUri } from 'lbry-redux';
import ClaimRepostAuthor from './view';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri, false)(state),
});

export default connect(select)(ClaimRepostAuthor);
