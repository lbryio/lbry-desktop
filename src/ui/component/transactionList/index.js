import { connect } from 'react-redux';
import { selectClaimedRewardsByTransactionId } from 'lbryinc';
import { doOpenModal } from 'redux/actions/app';
import {
  selectAllMyClaimsByOutpoint,
  selectSupportsById,
  selectTransactionListFilter,
  doSetTransactionListFilter,
} from 'lbry-redux';
import TransactionList from './view';

const select = state => ({
  rewards: selectClaimedRewardsByTransactionId(state),
  mySupports: selectSupportsById(state),
  myClaims: selectAllMyClaimsByOutpoint(state),
  filterSetting: selectTransactionListFilter(state),
});

const perform = dispatch => ({
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
  setTransactionFilter: filterSetting => dispatch(doSetTransactionListFilter(filterSetting)),
});

export default connect(
  select,
  perform
)(TransactionList);
