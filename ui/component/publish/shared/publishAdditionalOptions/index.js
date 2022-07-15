import { connect } from 'react-redux';
import { selectPublishFormValues } from 'redux/selectors/publish';
import { doUpdatePublishForm } from 'redux/actions/publish';
import PublishAdditionalOptions from './view';
import { selectUser } from 'redux/selectors/user';

const select = (state) => ({
  ...selectPublishFormValues(state),
  user: selectUser(state),
});

const perform = (dispatch) => ({
  updatePublishForm: (value) => dispatch(doUpdatePublishForm(value)),
});

export default connect(select, perform)(PublishAdditionalOptions);
