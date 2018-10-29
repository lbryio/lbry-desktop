import { connect } from 'react-redux';
import { selectClaimedRewardsByTransactionId } from 'lbryinc';
import { doNavigate } from 'redux/actions/navigation';
import {
  selectAllMyClaimsByOutpoint,
  doNotify,
  selectTransactionListFilter,
  doSetTransactionListFilter,
} from 'lbry-redux';
import TransactionList from './view';

const select = state => ({
  rewards: selectClaimedRewardsByTransactionId(state),
  myClaims: selectAllMyClaimsByOutpoint(state),
  filterSetting: selectTransactionListFilter(state),
});

const perform = dispatch => ({
  navigate: (path, params) => dispatch(doNavigate(path, params)),
  openModal: (modal, props) => dispatch(doNotify(modal, props)),
  setTransactionFilter: filterSetting => dispatch(doSetTransactionListFilter(filterSetting)),
});

export default connect(
  select,
  perform
)(TransactionList);
