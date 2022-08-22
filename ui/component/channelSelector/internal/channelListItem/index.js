import { connect } from 'react-redux';
import { selectClaimUriForId, selectClaimsByUri } from 'redux/selectors/claims';
import { doFetchUserMemberships } from 'redux/actions/user';

import ChannelListItem from './view';

const select = (state, props) => {
  const { channelId } = props;

  return {
    uri: selectClaimUriForId(state, channelId),
    claimsByUri: selectClaimsByUri(state),
  };
};

const perform = {
  doFetchUserMemberships,
};

export default connect(select, perform)(ChannelListItem);
