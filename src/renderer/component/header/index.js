import { connect } from 'react-redux';
import { doNavigate } from 'redux/actions/navigation';
import { selectIsUpgradeAvailable, selectAutoUpdateDownloaded } from 'redux/selectors/app';
import { formatCredits } from 'util/formatCredits';
import { selectBalance } from 'redux/selectors/wallet';
import Header from './view';
import { doDownloadUpgradeRequested } from 'redux/actions/app';

const select = state => ({
  isUpgradeAvailable: selectIsUpgradeAvailable(state),
  autoUpdateDownloaded: selectAutoUpdateDownloaded(state),
  balance: formatCredits(selectBalance(state) || 0, 2),
});

const perform = dispatch => ({
  navigate: path => dispatch(doNavigate(path)),
  back: () => dispatch(doHistoryBack()),
  forward: () => dispatch(doHistoryForward()),
  downloadUpgradeRequested: () => dispatch(doDownloadUpgradeRequested()),
});

export default connect(select, perform)(Header);
