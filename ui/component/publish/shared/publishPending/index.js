import { connect } from 'react-redux';
import { doCheckReflectingFiles } from 'redux/actions/publish';
import { makeSelectReflectingClaimForUri } from 'redux/selectors/claims';
import PublishPending from './view';

const select = (state, props) => ({
  reflectingInfo: props.uri && makeSelectReflectingClaimForUri(props.uri)(state),
});

const perform = (dispatch) => ({
  checkReflecting: () => dispatch(doCheckReflectingFiles()),
});

export default connect(select, perform)(PublishPending);
