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
import { selectIsUpgradeAvailable } from 'redux/selectors/app';
import { doDownloadUpgrade } from 'redux/actions/app';
import header from './view';

const select = state => ({
  isBackDisabled: selectIsBackDisabled(state),
  isForwardDisabled: selectIsForwardDisabled(state),
  isUpgradeAvailable: selectIsUpgradeAvailable(state),
  balance: formatCredits(selectBalance(state) || 0, 2),
});

const perform = dispatch => ({
  navigate: path => dispatch(doNavigate(path)),
  back: () => dispatch(doHistoryBack()),
  forward: () => dispatch(doHistoryForward()),
  downloadUpgrade: () => dispatch(doDownloadUpgrade()),
});

export default connect(select, perform)(header);
