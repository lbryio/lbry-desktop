import * as settings from 'constants/settings';
import { connect } from 'react-redux';
import { doHideModal } from 'redux/actions/app';
import { doSetClientSetting } from 'redux/actions/settings';
import ModalWelcome from './view';

const perform = dispatch => () => ({
  closeModal: () => {
    dispatch(doSetClientSetting(settings.NEW_USER_ACKNOWLEDGED, true));
    dispatch(doHideModal());
  },
});

export default connect(
  null,
  perform
)(ModalWelcome);
