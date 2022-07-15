import { connect } from 'react-redux';
import { selectBalance } from 'redux/selectors/wallet';
import { selectIsStillEditing, selectPublishFormValue } from 'redux/selectors/publish';
import { doUpdatePublishForm } from 'redux/actions/publish';
import { doToast } from 'redux/actions/notifications';
import PublishLivestream from './view';

const select = (state) => ({
  name: selectPublishFormValue(state, 'name'),
  title: selectPublishFormValue(state, 'title'),
  filePath: selectPublishFormValue(state, 'filePath'),
  isStillEditing: selectIsStillEditing(state),
  balance: selectBalance(state),
  publishing: selectPublishFormValue(state, 'publishing'),
  size: selectPublishFormValue(state, 'fileSize'),
  duration: selectPublishFormValue(state, 'fileDur'),
  isVid: selectPublishFormValue(state, 'fileVid'),
});

const perform = {
  doUpdatePublishForm,
  doToast,
};

export default connect(select, perform)(PublishLivestream);
