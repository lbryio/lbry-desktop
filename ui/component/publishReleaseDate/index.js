import { connect } from 'react-redux';
import { doUpdatePublishForm, makeSelectPublishFormValue } from 'lbry-redux';
import PublishReleaseDate from './view';

const select = (state) => ({
  releaseTime: makeSelectPublishFormValue('release_time')(state),
});

const perform = (dispatch) => ({
  updatePublishForm: (value) => dispatch(doUpdatePublishForm(value)),
});

export default connect(select, perform)(PublishReleaseDate);
