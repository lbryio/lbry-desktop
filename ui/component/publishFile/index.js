import { connect } from 'react-redux';
import {
  selectBalance,
  selectIsStillEditing,
  makeSelectPublishFormValue,
  doUpdatePublishForm,
  doToast,
  doClearPublish,
} from 'lbry-redux';
import PublishPage from './view';

const select = state => ({
  name: makeSelectPublishFormValue('name')(state),
  filePath: makeSelectPublishFormValue('filePath')(state),
  isStillEditing: selectIsStillEditing(state),
  balance: selectBalance(state),
  publishing: makeSelectPublishFormValue('publishing')(state),
});

const perform = dispatch => ({
  clearPublish: () => dispatch(doClearPublish()),
  updatePublishForm: value => dispatch(doUpdatePublishForm(value)),
  showToast: message => dispatch(doToast({ message, isError: true })),
});

export default connect(
  select,
  perform
)(PublishPage);
