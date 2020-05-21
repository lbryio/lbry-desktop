import { connect } from 'react-redux';
import { makeSelectFilePartlyDownloaded, makeSelectClaimIsMine } from 'lbry-redux';
import { makeSelectIsSubscribed, makeSelectIsNew } from 'redux/selectors/subscriptions';
import FileProperties from './view';

const select = (state, props) => ({
  downloaded: makeSelectFilePartlyDownloaded(props.uri)(state),
  isSubscribed: makeSelectIsSubscribed(props.uri)(state),
  isNew: makeSelectIsNew(props.uri)(state),
  claimIsMine: makeSelectClaimIsMine(props.uri)(state),
});

export default connect(select, null)(FileProperties);
