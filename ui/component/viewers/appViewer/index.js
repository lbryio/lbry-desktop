import { connect } from 'react-redux';
import { makeSelectClaimForUri, makeSelectContentTypeForUri } from 'lbry-redux';
import AppViewer from './view';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  contentType: makeSelectContentTypeForUri(props.uri)(state),
});

const perform = dispatch => ({});

export default connect(
  select,
  perform
)(AppViewer);
