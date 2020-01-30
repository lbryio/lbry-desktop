import { connect } from 'react-redux';
import { makeSelectClaimForUri, makeSelectTitleForUri } from 'lbry-redux';
import ClaimPreview from './view';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  title: makeSelectTitleForUri(props.uri)(state),
});

export default connect(select)(ClaimPreview);
