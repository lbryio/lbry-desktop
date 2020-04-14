import { connect } from 'react-redux';
import { selectClaimedRewardsByTransactionId } from 'lbryinc';
import { doOpenModal } from 'redux/actions/app';
import { selectIsFetchingTxos } from 'lbry-redux';
import TransactionListTable from './view';

const select = state => ({
  rewards: selectClaimedRewardsByTransactionId(state),
  loading: selectIsFetchingTxos(state),
});

const perform = dispatch => ({
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
});

export default connect(select, perform)(TransactionListTable);
