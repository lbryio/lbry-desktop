import * as SETTINGS from 'constants/settings';
import { connect } from 'react-redux';
import { selectBalance } from 'lbry-redux';
import { doGetSync, selectSyncHash, selectUserVerifiedEmail } from 'lbryinc';
import { doSetClientSetting } from 'redux/actions/settings';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import WalletSecurityAndSync from './view';

const select = state => ({
  balance: selectBalance(state),
  verifiedEmail: selectUserVerifiedEmail(state),
  syncEnabled: makeSelectClientSetting(SETTINGS.ENABLE_SYNC)(state),
  hasSyncHash: selectSyncHash(state),
});

const perform = dispatch => ({
  getSync: password => dispatch(doGetSync(password)),
  setSync: value => dispatch(doSetClientSetting(SETTINGS.ENABLE_SYNC, value)),
});

export default connect(
  select,
  perform
)(WalletSecurityAndSync);
