import { connect } from 'react-redux';
import { makeSelectClaimForUri, makeSelectContentTypeForUri } from 'redux/selectors/claims';
import AppViewer from './view';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  contentType: makeSelectContentTypeForUri(props.uri)(state),
});

const perform = (dispatch) => ({});

export default connect(select, perform)(AppViewer);
