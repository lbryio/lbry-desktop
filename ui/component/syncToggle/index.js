import { SETTINGS } from 'lbry-redux';
import { connect } from 'react-redux';
import { selectUserVerifiedEmail } from 'redux/selectors/user';
import { selectGetSyncErrorMessage } from 'redux/selectors/sync';
import { makeSelectClientSetting, selectLanguage } from 'redux/selectors/settings';
import { doSetWalletSyncPreference } from 'redux/actions/settings';
import { doOpenModal } from 'redux/actions/app';
import SyncToggle from './view';

const select = state => ({
  syncEnabled: makeSelectClientSetting(SETTINGS.ENABLE_SYNC)(state),
  verifiedEmail: selectUserVerifiedEmail(state),
  getSyncError: selectGetSyncErrorMessage(state),
  language: selectLanguage(state),
});

const perform = dispatch => ({
  setSyncEnabled: value => dispatch(doSetWalletSyncPreference(value)),
  openModal: (id, props) => dispatch(doOpenModal(id, props)),
});

export default connect(select, perform)(SyncToggle);
