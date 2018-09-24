import { connect } from 'react-redux';
import { selectClaimedRewardsByTransactionId } from 'lbryinc';
import { doNavigate } from 'redux/actions/navigation';
import { selectAllMyClaimsByOutpoint, doNotify } from 'lbry-redux';
import TransactionList from './view';

const select = state => ({
  rewards: selectClaimedRewardsByTransactionId(state),
  myClaims: selectAllMyClaimsByOutpoint(state),
});

const perform = dispatch => ({
  navigate: (path, params) => dispatch(doNavigate(path, params)),
  openModal: (modal, props) => dispatch(doNotify(modal, props)),
});

export default connect(
  select,
  perform
)(TransactionList);
