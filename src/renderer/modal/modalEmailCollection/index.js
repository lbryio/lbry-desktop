import * as settings from 'constants/settings';
import { connect } from 'react-redux';
import { doHideModal } from 'redux/actions/app';
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
    dispatch(doHideModal());
  },
});

export default connect(
  select,
  perform
)(ModalEmailCollection);
