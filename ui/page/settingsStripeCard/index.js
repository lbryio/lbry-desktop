import { connect } from 'react-redux';
import { doSetClientSetting } from 'redux/actions/settings';
import { selectClientSetting } from 'redux/selectors/settings';
import { selectUserVerifiedEmail, selectUserEmail, selectUserLocale } from 'redux/selectors/user';
import { doOpenModal } from 'redux/actions/app';
import { doToast } from 'redux/actions/notifications';
import * as SETTINGS from 'constants/settings';

import SettingsStripeCard from './view';

const select = (state) => ({
  isAuthenticated: Boolean(selectUserVerifiedEmail(state)),
  email: selectUserEmail(state),
  preferredCurrency: selectClientSetting(state, SETTINGS.PREFERRED_CURRENCY),
  locale: selectUserLocale(state),
});

const perform = (dispatch) => ({
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
  doToast: (options) => dispatch(doToast(options)),
  setPreferredCurrency: (value) => {
    dispatch(doSetClientSetting(SETTINGS.PREFERRED_CURRENCY, value, true));
  },
});

export default connect(select, perform)(SettingsStripeCard);
