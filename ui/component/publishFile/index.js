import { connect } from 'react-redux';
import { selectBalance } from 'redux/selectors/wallet';
import { selectIsStillEditing, makeSelectPublishFormValue } from 'redux/selectors/publish';
import { doUpdatePublishForm, doClearPublish } from 'redux/actions/publish';
import { selectIsStreamPlaceholderForUri } from 'redux/selectors/claims';
import { doToast } from 'redux/actions/notifications';
import { selectFfmpegStatus } from 'redux/selectors/settings';
import PublishPage from './view';

const select = (state, props) => ({
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
  isLivestreamClaim: selectIsStreamPlaceholderForUri(state, props.uri),
});

const perform = {
  doClearPublish,
  doUpdatePublishForm,
  doToast,
};

export default connect(select, perform)(PublishPage);
