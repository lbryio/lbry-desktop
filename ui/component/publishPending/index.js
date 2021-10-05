import { connect } from 'react-redux';
import { makeSelectReflectingClaimForUri, doCheckReflectingFiles } from 'lbry-redux';
import PublishPending from './view';

const select = (state, props) => ({
  reflectingInfo: props.uri && makeSelectReflectingClaimForUri(props.uri)(state),
});

const perform = dispatch => ({
  checkReflecting: () => dispatch(doCheckReflectingFiles()),
});

export default connect(select, perform)(PublishPending);
