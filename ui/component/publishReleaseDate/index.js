import { connect } from 'react-redux';
import { doUpdatePublishForm, makeSelectPublishFormValue } from 'lbry-redux';
import PublishReleaseDate from './view';

const select = (state) => ({
  releaseTime: makeSelectPublishFormValue('releaseTime')(state),
  releaseTimeEdited: makeSelectPublishFormValue('releaseTimeEdited')(state),
});

const perform = (dispatch) => ({
  updatePublishForm: (value) => dispatch(doUpdatePublishForm(value)),
});

export default connect(select, perform)(PublishReleaseDate);
