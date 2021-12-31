import { connect } from 'react-redux';
import {
  makeSelectClaimForUri,
  selectTotalStakedAmountForChannelUri,
  selectStakedLevelForChannelUri,
} from 'redux/selectors/claims';
import ChannelStakedIndicator from './view';

const select = (state, props) => ({
  channelClaim: makeSelectClaimForUri(props.uri)(state),
  amount: selectTotalStakedAmountForChannelUri(state, props.uri),
  level: selectStakedLevelForChannelUri(state, props.uri),
});

export default connect(select)(ChannelStakedIndicator);
