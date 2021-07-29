import { makeSelectRewardByType } from 'redux/selectors/rewards';
import rewards from 'rewards';
import { connect } from 'react-redux';
import { doHideModal } from 'redux/actions/app';
import ModalFirstReward from './view';

const select = state => {
  const selectReward = makeSelectRewardByType();

  return {
    reward: selectReward(state, rewards.TYPE_NEW_USER),
  };
};

const perform = dispatch => ({
  closeModal: () => dispatch(doHideModal()),
});

export default connect(select, perform)(ModalFirstReward);
