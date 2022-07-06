import { connect } from 'react-redux';
import { makeSelectClaimForUri } from 'redux/selectors/claims';
import ClaimRepostAuthor from './view';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
});

export default connect(select)(ClaimRepostAuthor);
