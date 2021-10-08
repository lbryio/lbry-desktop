import { connect } from 'react-redux';
import { makeSelectPublishFormValue } from 'redux/selectors/publish';
import { doUpdatePublishForm } from 'redux/actions/publish';
import PublishPage from './view';

const select = (state) => ({
  contentIsFree: makeSelectPublishFormValue('contentIsFree')(state),
  fee: makeSelectPublishFormValue('fee')(state),
});

const perform = (dispatch) => ({
  updatePublishForm: (values) => dispatch(doUpdatePublishForm(values)),
});

export default connect(select, perform)(PublishPage);
