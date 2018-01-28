import { formatCredits } from 'util/formatCredits';
import { connect } from 'react-redux';
import {
  doNavigate,
  doHistoryBack,
  doHistoryForward,
  selectBalance,
  selectIsBackDisabled,
  selectIsForwardDisabled,
} from 'lbry-redux';
import { selectIsUpgradeAvailable, selectAutoUpdateDownloaded } from 'redux/selectors/app';
import { doDownloadUpgradeRequested } from 'redux/actions/app';
import header from './view';

const select = state => ({
  isBackDisabled: selectIsBackDisabled(state),
  isForwardDisabled: selectIsForwardDisabled(state),
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

export default connect(select, perform)(header);
