import { connect } from 'react-redux';
import { selectPublishFormValues } from 'redux/selectors/publish';
import { doUpdatePublishForm } from 'redux/actions/publish';
import PublishAdditionalOptions from './view';

const select = (state) => ({
  ...selectPublishFormValues(state),
});

const perform = (dispatch) => ({
  updatePublishForm: (value) => dispatch(doUpdatePublishForm(value)),
});

export default connect(select, perform)(PublishAdditionalOptions);
