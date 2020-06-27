import { connect } from 'react-redux';
import {
  selectBalance,
  selectIsStillEditing,
  makeSelectPublishFormValue,
  doUpdatePublishForm,
  doClearPublish,
} from 'lbry-redux';
import { doToast } from 'redux/actions/notifications';
import PublishPage from './view';

const select = state => ({
  title: makeSelectPublishFormValue('title')(state),
  description: makeSelectPublishFormValue('description')(state),
  name: makeSelectPublishFormValue('name')(state),
  filePath: makeSelectPublishFormValue('filePath')(state),
  isStillEditing: selectIsStillEditing(state),
  balance: selectBalance(state),
  publishing: makeSelectPublishFormValue('publishing')(state),
  size: makeSelectPublishFormValue('fileSize')(state),
});

const perform = dispatch => ({
  clearPublish: () => dispatch(doClearPublish()),
  updatePublishForm: value => dispatch(doUpdatePublishForm(value)),
  showToast: message => dispatch(doToast({ message, isError: true })),
});

export default connect(select, perform)(PublishPage);
