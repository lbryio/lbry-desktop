import { connect } from 'react-redux';
import { makeSelectFilePartlyDownloaded, makeSelectClaimIsMine, makeSelectClaimForUri } from 'lbry-redux';
import { selectRewardContentClaimIds } from 'lbryinc';
import { makeSelectIsSubscribed, makeSelectIsNew } from 'redux/selectors/subscriptions';
import FileProperties from './view';

const select = (state, props) => ({
  rewardedContentClaimIds: selectRewardContentClaimIds(state, props),
  downloaded: makeSelectFilePartlyDownloaded(props.uri)(state),
  isSubscribed: makeSelectIsSubscribed(props.uri)(state),
  isNew: makeSelectIsNew(props.uri)(state),
  claimIsMine: makeSelectClaimIsMine(props.uri)(state),
  claim: makeSelectClaimForUri(props.uri)(state),
});

export default connect(
  select,
  null
)(FileProperties);
