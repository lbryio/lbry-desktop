import * as settings from 'constants/settings';
import { connect } from 'react-redux';
import { doHideNotification } from 'lbry-redux';
import { doSetClientSetting } from 'redux/actions/settings';
import ModalWelcome from './view';

const perform = dispatch => () => ({
  closeModal: () => {
    dispatch(doSetClientSetting(settings.NEW_USER_ACKNOWLEDGED, true));
    dispatch(doHideNotification());
  },
});

export default connect(null, perform)(ModalWelcome);
