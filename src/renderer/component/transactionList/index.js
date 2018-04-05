import { connect } from 'react-redux';
import { selectClaimedRewardsByTransactionId } from 'redux/selectors/rewards';
import { doNavigate } from 'redux/actions/navigation';
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
