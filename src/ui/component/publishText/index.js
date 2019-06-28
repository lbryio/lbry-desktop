import { connect } from 'react-redux';
import { makeSelectPublishFormValue } from 'redux/selectors/publish';
import { doUpdatePublishForm } from 'redux/actions/publish';
import PublishPage from './view';

const select = state => ({
  title: makeSelectPublishFormValue('title')(state),
  description: makeSelectPublishFormValue('description')(state),
});

const perform = dispatch => ({
  updatePublishForm: value => dispatch(doUpdatePublishForm(value)),
});

export default connect(
  select,
  perform
)(PublishPage);
