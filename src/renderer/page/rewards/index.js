import { connect } from 'react-redux';
import {
  selectFetchingRewards,
  selectUnclaimedRewards,
  selectClaimedRewards,
} from 'redux/selectors/rewards';
import { selectUser } from 'redux/selectors/user';
import { doAuthNavigate, doNavigate } from 'redux/actions/navigation';
import { doRewardList } from 'redux/actions/rewards';
import { selectDaemonSettings } from 'redux/selectors/settings';
import RewardsPage from './view';

const select = state => ({
  daemonSettings: selectDaemonSettings(state),
  fetching: selectFetchingRewards(state),
  rewards: selectUnclaimedRewards(state),
  claimed: selectClaimedRewards(state),
  user: selectUser(state),
});

const perform = dispatch => ({
  fetchRewards: () => dispatch(doRewardList()),
  navigate: path => dispatch(doNavigate(path)),
  doAuth: () => {
    dispatch(doAuthNavigate('/rewards'));
  },
});

export default connect(
  select,
  perform
)(RewardsPage);
