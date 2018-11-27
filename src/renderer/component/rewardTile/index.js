import * as MODALS from 'constants/modal_types';
import { connect } from 'react-redux';
import { doOpenModal } from 'redux/actions/app';
import RewardTile from './view';

const perform = dispatch => ({
  openRewardCodeModal: () => dispatch(doOpenModal(MODALS.REWARD_GENERATED_CODE)),
});

export default connect(
  null,
  perform
)(RewardTile);
