import { connect } from 'react-redux';
import { doSetClientSetting } from 'redux/actions/settings';
import { selectosNotificationsEnabled } from 'redux/selectors/settings';
import { selectUserVerifiedEmail, selectUserEmail } from 'redux/selectors/user';
import { doOpenModal } from 'redux/actions/app';
import { doToast } from 'redux/actions/notifications';

import SettingsStripeCard from './view';

const select = (state) => ({
  osNotificationsEnabled: selectosNotificationsEnabled(state),
  isAuthenticated: Boolean(selectUserVerifiedEmail(state)),
  email: selectUserEmail(state),
});

const perform = (dispatch) => ({
  setClientSetting: (key, value) => dispatch(doSetClientSetting(key, value)),
  doOpenModal,
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
  doToast: (options) => dispatch(doToast(options)),
});

export default connect(select, perform)(SettingsStripeCard);
