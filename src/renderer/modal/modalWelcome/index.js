import * as settings from 'constants/settings';
import { connect } from 'react-redux';
import { doCloseModal } from 'lbry-redux';
import { doSetClientSetting } from 'redux/actions/settings';
import ModalWelcome from './view';

const perform = dispatch => () => ({
  closeModal: () => {
    dispatch(doSetClientSetting(settings.NEW_USER_ACKNOWLEDGED, true));
    dispatch(doCloseModal());
  },
});

export default connect(null, perform)(ModalWelcome);
