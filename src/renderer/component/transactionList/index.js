import { connect } from 'react-redux';
import { doNavigate } from 'redux/actions/navigation';
import { selectClaimedRewardsByTransactionId } from 'redux/selectors/rewards';
import { doOpenModal, selectAllMyClaimsByOutpoint } from 'lbry-redux';
import TransactionList from './view';

const select = state => ({
  rewards: selectClaimedRewardsByTransactionId(state),
  myClaims: selectAllMyClaimsByOutpoint(state),
});

const perform = dispatch => ({
  navigate: (path, params) => dispatch(doNavigate(path, params)),
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
});

export default connect(select, perform)(TransactionList);
