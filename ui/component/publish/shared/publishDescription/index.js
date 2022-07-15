import { connect } from 'react-redux';
import { selectPublishFormValue } from 'redux/selectors/publish';
import { doUpdatePublishForm } from 'redux/actions/publish';
import PublishDescription from './view';

const select = (state) => ({
  description: selectPublishFormValue(state, 'description'),
});

const perform = (dispatch) => ({
  updatePublishForm: (value) => dispatch(doUpdatePublishForm(value)),
});

export default connect(select, perform)(PublishDescription);
