import { connect } from 'react-redux';
import { selectBalance } from 'lbry-redux';
import { formatCredits } from 'util/format-credits';
import { selectIsUpgradeAvailable, selectAutoUpdateDownloaded } from 'redux/selectors/app';
import { doDownloadUpgradeRequested } from 'redux/actions/app';
import Header from './view';

const select = state => ({
  autoUpdateDownloaded: selectAutoUpdateDownloaded(state),
  balance: selectBalance(state),
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
