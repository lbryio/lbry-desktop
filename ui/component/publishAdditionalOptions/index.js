import { connect } from 'react-redux';
import { selectPublishFormValues, doUpdatePublishForm } from 'lbry-redux';
import PublishPage from './view';

const select = state => ({
  ...selectPublishFormValues(state),
});

const perform = dispatch => ({
  updatePublishForm: value => dispatch(doUpdatePublishForm(value)),
});

export default connect(
  select,
  perform
)(PublishPage);
