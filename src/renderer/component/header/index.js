import { connect } from 'react-redux';
import { doNavigate } from 'redux/actions/navigation';
import { selectIsUpgradeAvailable } from 'redux/selectors/app';
import { formatCredits } from 'util/formatCredits';
import { selectBalance } from 'redux/selectors/wallet';
import Header from './view';

const select = state => ({
  isUpgradeAvailable: selectIsUpgradeAvailable(state),
  balance: formatCredits(selectBalance(state) || 0, 2),
});

const perform = dispatch => ({
  navigate: path => dispatch(doNavigate(path)),
});

export default connect(select, perform)(Header);
