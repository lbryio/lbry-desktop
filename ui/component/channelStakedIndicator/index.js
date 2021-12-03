import { connect } from 'react-redux';
import {
  selectClaimForUri,
  selectStakedLevelForChannelUri,
  selectTotalStakedAmountForChannelUri,
} from 'redux/selectors/claims';
import ChannelStakedIndicator from './view';

const select = (state, props) => ({
  channelClaim: selectClaimForUri(state, props.uri),
  amount: selectTotalStakedAmountForChannelUri(state, props.uri),
  level: selectStakedLevelForChannelUri(state, props.uri),
});

export default connect(select)(ChannelStakedIndicator);
