import { connect } from 'react-redux';
import { doDownloadUpgradeRequested } from 'redux/actions/app';
import { doNavigate } from 'redux/actions/navigation';
import { selectIsUpgradeAvailable, selectAutoUpdateDownloaded } from 'redux/selectors/app';
import { selectBalance } from 'redux/selectors/wallet';
import { formatCredits } from 'util/formatCredits';
import Header from './view';

const select = state => ({
  autoUpdateDownloaded: selectAutoUpdateDownloaded(state),
  balance: selectBalance(state),
  isUpgradeAvailable: selectIsUpgradeAvailable(state),
  roundedBalance: formatCredits(selectBalance(state) || 0, 2),
});

const perform = dispatch => ({
  downloadUpgradeRequested: () => dispatch(doDownloadUpgradeRequested()),
  navigate: path => dispatch(doNavigate(path)),
});

export default connect(select, perform)(Header);
