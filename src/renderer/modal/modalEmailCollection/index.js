import * as settings from 'constants/settings';
import { connect } from 'react-redux';
import { doHideNotification } from 'lbry-redux';
import { doSetClientSetting } from 'redux/actions/settings';
import { selectEmailToVerify, selectUser } from 'lbryinc';
import ModalEmailCollection from './view';

const select = state => ({
  email: selectEmailToVerify(state),
  user: selectUser(state),
});

const perform = dispatch => () => ({
  closeModal: () => {
    dispatch(doSetClientSetting(settings.EMAIL_COLLECTION_ACKNOWLEDGED, true));
    dispatch(doHideNotification());
  },
});

export default connect(
  select,
  perform
)(ModalEmailCollection);
