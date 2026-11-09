//@ts-nocheck
import {connect} from 'react-redux';
import { selectHasChannels, selectFetchingMyChannels } from 'redux/selectors/claims';
import { selectActiveChannelClaim } from 'redux/selectors/app';
import { doSetActiveChannel } from 'redux/actions/app';
import CreatorDashboardPage from './view';

const select = (state: unknown) => ({
  hasChannels: selectHasChannels(state),
  fetchingChannels: selectFetchingMyChannels(state),
  activeChannelClaim: selectActiveChannelClaim(state),
});

export default connect(select, { doSetActiveChannel })(CreatorDashboardPage);
