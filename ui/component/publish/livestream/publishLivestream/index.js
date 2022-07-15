import { connect } from 'react-redux';
import { selectBalance } from 'redux/selectors/wallet';
import { selectIsStillEditing, makeSelectPublishFormValue } from 'redux/selectors/publish';
import { doUpdatePublishForm, doClearPublish } from 'redux/actions/publish';
import { doToast } from 'redux/actions/notifications';
import LivestreamCreatePage from './view';

const select = (state) => ({
  name: makeSelectPublishFormValue('name')(state),
  title: makeSelectPublishFormValue('title')(state),
  filePath: makeSelectPublishFormValue('filePath')(state),
  remoteUrl: makeSelectPublishFormValue('remoteFileUrl')(state),
  isStillEditing: selectIsStillEditing(state),
  balance: selectBalance(state),
  publishing: makeSelectPublishFormValue('publishing')(state),
  size: makeSelectPublishFormValue('fileSize')(state),
  duration: makeSelectPublishFormValue('fileDur')(state),
  isVid: makeSelectPublishFormValue('fileVid')(state),
});

const perform = {
  doClearPublish,
  doUpdatePublishForm,
  doToast,
};

export default connect(select, perform)(LivestreamCreatePage);
