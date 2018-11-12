import { connect } from 'react-redux';
import { MODALS, doNotify } from 'lbry-redux';
import RewardTile from './view';

const perform = dispatch => ({
  openRewardCodeModal: () => dispatch(doNotify({ id: MODALS.REWARD_GENERATED_CODE })),
});

export default connect(
  null,
  perform
)(RewardTile);
