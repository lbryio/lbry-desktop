import { connect } from 'react-redux';
import { selectPublishFormValues, doUpdatePublishForm, doToast } from 'lbry-redux';
import PublishPage from './view';

const select = state => ({
  ...selectPublishFormValues(state),
});

const perform = dispatch => ({
  updatePublishForm: value => dispatch(doUpdatePublishForm(value)),
  showToast: message => dispatch(doToast({ isError: true, message })),
});

export default connect(
  select,
  perform
)(PublishPage);
