import { connect } from 'react-redux';
import { makeSelectPublishFormValue } from 'redux/selectors/publish';
import { doUpdatePublishForm } from 'redux/actions/publish';
import PublishStreamReleaseDate from './view';

const select = (state) => ({
  releaseTime: makeSelectPublishFormValue('releaseTime')(state),
});

const perform = (dispatch) => ({
  updatePublishForm: (value) => dispatch(doUpdatePublishForm(value)),
});

export default connect(select, perform)(PublishStreamReleaseDate);
