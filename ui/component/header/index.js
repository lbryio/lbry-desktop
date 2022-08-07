import { connect } from 'react-redux';
import { doSignOut } from 'redux/actions/app';
import { formatCredits } from 'util/format-credits';
import { selectClientSetting } from 'redux/selectors/settings';
import { selectGetSyncErrorMessage } from 'redux/selectors/sync';
import { selectHasNavigated } from 'redux/selectors/app';
import { selectTotalBalance, selectBalance } from 'redux/selectors/wallet';
import * as SETTINGS from 'constants/settings';
import Header from './view';

const select = (state) => ({
  balance: selectBalance(state),
  hasNavigated: selectHasNavigated(state),
  hideBalance: selectClientSetting(state, SETTINGS.HIDE_BALANCE),
  roundedBalance: formatCredits(selectTotalBalance(state), 2, true),
  roundedSpendableBalance: formatCredits(selectBalance(state), 2, true),
  syncError: selectGetSyncErrorMessage(state),
});

const perform = (dispatch) => ({
  signOut: () => dispatch(doSignOut()),
});

export default connect(select, perform)(Header);
