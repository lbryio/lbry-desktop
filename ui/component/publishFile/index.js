import { connect } from 'react-redux';
import { selectBalance } from 'redux/selectors/wallet';
import { selectIsStillEditing, makeSelectPublishFormValue } from 'redux/selectors/publish';
import { doUpdatePublishForm, doClearPublish } from 'redux/actions/publish';
import { doToast } from 'redux/actions/notifications';
import { selectFfmpegStatus } from 'redux/selectors/settings';
import PublishPage from './view';

const select = (state) => ({
  name: makeSelectPublishFormValue('name')(state),
  title: makeSelectPublishFormValue('title')(state),
  filePath: makeSelectPublishFormValue('filePath')(state),
  remoteUrl: makeSelectPublishFormValue('remoteFileUrl')(state),
  optimize: makeSelectPublishFormValue('optimize')(state),
  isStillEditing: selectIsStillEditing(state),
  balance: selectBalance(state),
  publishing: makeSelectPublishFormValue('publishing')(state),
  ffmpegStatus: selectFfmpegStatus(state),
  size: makeSelectPublishFormValue('fileSize')(state),
  duration: makeSelectPublishFormValue('fileDur')(state),
  isVid: makeSelectPublishFormValue('fileVid')(state),
});

const perform = (dispatch) => ({
  clearPublish: () => dispatch(doClearPublish()),
  updatePublishForm: (value) => dispatch(doUpdatePublishForm(value)),
  showToast: (message) => dispatch(doToast({ message, isError: true })),
});

export default connect(select, perform)(PublishPage);
