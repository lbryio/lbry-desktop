import rewards from 'rewards';
import { connect } from 'react-redux';
import { doHideNotification } from 'lbry-redux';
import { makeSelectRewardByType } from 'redux/selectors/rewards';
import ModalFirstReward from './view';

const select = state => {
  const selectReward = makeSelectRewardByType();

  return {
    reward: selectReward(state, rewards.TYPE_NEW_USER),
  };
};

const perform = dispatch => ({
  closeModal: () => dispatch(doHideNotification()),
});

export default connect(select, perform)(ModalFirstReward);
