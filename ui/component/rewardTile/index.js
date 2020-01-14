import * as MODALS from 'constants/modal_types';
import { connect } from 'react-redux';
import { doOpenModal } from 'redux/actions/app';
import RewardTile from './view';
import { selectUser } from 'lbryinc';

const select = state => ({
  user: selectUser(state),
});
const perform = dispatch => ({
  openRewardCodeModal: () => dispatch(doOpenModal(MODALS.REWARD_GENERATED_CODE)),
  openSetReferrerModal: () => dispatch(doOpenModal(MODALS.SET_REFERRER)),
});

export default connect(
  select,
  perform
)(RewardTile);
