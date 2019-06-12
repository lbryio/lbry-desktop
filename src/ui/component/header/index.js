import { connect } from 'react-redux';
import { selectBalance, SETTINGS } from 'lbry-redux';
import { formatCredits } from 'util/format-credits';
import { selectIsUpgradeAvailable, selectAutoUpdateDownloaded } from 'redux/selectors/app';
import { doDownloadUpgradeRequested } from 'redux/actions/app';
import Header from './view';
import { makeSelectClientSetting } from 'redux/selectors/settings';

const select = state => ({
  autoUpdateDownloaded: selectAutoUpdateDownloaded(state),
  balance: selectBalance(state),
  language: makeSelectClientSetting(SETTINGS.LANGUAGE)(state), // trigger redraw on language change
  isUpgradeAvailable: selectIsUpgradeAvailable(state),
  roundedBalance: formatCredits(selectBalance(state) || 0, 2),
});

const perform = dispatch => ({
  downloadUpgradeRequested: () => dispatch(doDownloadUpgradeRequested()),
});

export default connect(
  select,
  perform
)(Header);
