import { connect } from 'react-redux';
import { doSetClientSetting } from 'redux/actions/settings';
import { selectosNotificationsEnabled } from 'redux/selectors/settings';
import { selectUserVerifiedEmail } from 'redux/selectors/user';
import NotificationSettingsPage from './view';

const select = (state) => ({
  osNotificationsEnabled: selectosNotificationsEnabled(state),
  isAuthenticated: Boolean(selectUserVerifiedEmail(state)),
});

const perform = (dispatch) => ({
  setClientSetting: (key, value) => dispatch(doSetClientSetting(key, value)),
});

export default connect(select, perform)(NotificationSettingsPage);
