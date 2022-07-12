import { connect } from 'react-redux';
import { doClearEmailEntry, doClearPasswordEntry } from 'redux/actions/user';
import { doSignOut } from 'redux/actions/app';
import { formatCredits } from 'util/format-credits';
import { selectClientSetting } from 'redux/selectors/settings';
import { selectGetSyncErrorMessage } from 'redux/selectors/sync';
import { selectHasNavigated } from 'redux/selectors/app';
import { selectTotalBalance, selectBalance } from 'redux/selectors/wallet';
import { selectEmailToVerify, selectUser } from 'redux/selectors/user';
import { doLbrysyncRegister } from 'redux/actions/lbrysync';
import * as SETTINGS from 'constants/settings';
import Header from './view';

const select = (state) => ({
  balance: selectBalance(state),
  emailToVerify: selectEmailToVerify(state),
  hasNavigated: selectHasNavigated(state),
  hideBalance: selectClientSetting(state, SETTINGS.HIDE_BALANCE),
  roundedBalance: formatCredits(selectTotalBalance(state), 2, true),
  roundedSpendableBalance: formatCredits(selectBalance(state), 2, true),
  syncError: selectGetSyncErrorMessage(state),
  user: selectUser(state),
});

const perform = (dispatch) => ({
  clearEmailEntry: () => dispatch(doClearEmailEntry()),
  clearPasswordEntry: () => dispatch(doClearPasswordEntry()),
  lbrysyncRegister: (username, password) => dispatch(doLbrysyncRegister(username, password)),
  signOut: () => dispatch(doSignOut()),
});

export default connect(select, perform)(Header);
