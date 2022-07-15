import { connect } from 'react-redux';
import { selectPublishFormValue } from 'redux/selectors/publish';
import { doUpdatePublishForm } from 'redux/actions/publish';
import PublishPrice from './view';

const select = (state) => ({
  contentIsFree: selectPublishFormValue(state, 'contentIsFree'),
  fee: selectPublishFormValue(state, 'fee'),
});

const perform = (dispatch) => ({
  updatePublishForm: (values) => dispatch(doUpdatePublishForm(values)),
});

export default connect(select, perform)(PublishPrice);
