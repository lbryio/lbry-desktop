import { connect } from 'react-redux';
import { makeSelectClaimForUri, makeSelectTitleForUri, makeSelectIsUriResolving } from 'lbry-redux';
import ClaimPreviewTitle from './view';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  title: makeSelectTitleForUri(props.uri)(state),
  isResolvingUri: makeSelectIsUriResolving(props.uri)(state),
});

export default connect(select)(ClaimPreviewTitle);
