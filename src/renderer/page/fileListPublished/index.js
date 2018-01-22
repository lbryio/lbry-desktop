import rewards from 'rewards';
import { connect } from 'react-redux';
import {
  doFetchClaimListMine,
  doNavigate,
  selectMyClaimsWithoutChannels,
  selectIsFetchingClaimListMine,
} from 'lbry-redux';
import { doClaimRewardType } from 'redux/actions/rewards';
import FileListPublished from './view';

const select = state => ({
  claims: selectMyClaimsWithoutChannels(state),
  isFetching: selectIsFetchingClaimListMine(state),
});

const perform = dispatch => ({
  navigate: path => dispatch(doNavigate(path)),
  fetchClaims: () => dispatch(doFetchClaimListMine()),
  claimFirstPublishReward: () => dispatch(doClaimRewardType(rewards.TYPE_FIRST_PUBLISH)),
});

export default connect(select, perform)(FileListPublished);
