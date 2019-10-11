import { connect } from 'react-redux';

import { selectBalance, selectIsStillEditing, makeSelectPublishFormValue, doUpdatePublishForm } from 'lbry-redux';
import PublishPage from './view';

const select = state => ({
  name: makeSelectPublishFormValue('name')(state),
  filePath: makeSelectPublishFormValue('filePath')(state),
  isStillEditing: selectIsStillEditing(state),
  balance: selectBalance(state),
  publishing: makeSelectPublishFormValue('publishing')(state),
});

const perform = dispatch => ({
  updatePublishForm: value => dispatch(doUpdatePublishForm(value)),
});

export default connect(
  select,
  perform
)(PublishPage);
