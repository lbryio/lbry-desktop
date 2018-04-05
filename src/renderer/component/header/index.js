import { connect } from 'react-redux';
import { selectBalance } from 'lbry-redux';
import { formatCredits } from 'util/formatCredits';
import { doNavigate } from 'redux/actions/navigation';
import { selectIsUpgradeAvailable, selectAutoUpdateDownloaded } from 'redux/selectors/app';
import { doDownloadUpgradeRequested } from 'redux/actions/app';
import Header from './view';

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
