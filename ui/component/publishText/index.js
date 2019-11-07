import { connect } from 'react-redux';
import { doUpdatePublishForm, makeSelectPublishFormValue } from 'lbry-redux';
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
