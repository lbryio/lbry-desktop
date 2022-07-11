import { connect } from 'react-redux';
import { makeSelectPublishFormValue, selectIsScheduled } from 'redux/selectors/publish';
import { doUpdatePublishForm } from 'redux/actions/publish';
import PublishStreamReleaseDate from './view';

const select = (state) => ({
  isScheduled: selectIsScheduled(state),
  releaseTime: makeSelectPublishFormValue('releaseTime')(state),
});

const perform = (dispatch) => ({
  updatePublishForm: (value) => dispatch(doUpdatePublishForm(value)),
});

export default connect(select, perform)(PublishStreamReleaseDate);
