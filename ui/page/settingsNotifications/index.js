import { connect } from 'react-redux';
import { doSetClientSetting } from 'redux/actions/settings';
import { selectosNotificationsEnabled } from 'redux/selectors/settings';
import NotificationSettingsPage from './view';

const select = (state) => ({
  osNotificationsEnabled: selectosNotificationsEnabled(state),
});

const perform = (dispatch) => ({
  setClientSetting: (key, value) => dispatch(doSetClientSetting(key, value)),
});

export default connect(select, perform)(NotificationSettingsPage);
