import { connect } from 'react-redux';
import {
  makeSelectClaimForUri,
  makeSelectStakedLevelForChannelUri,
  makeSelectTotalStakedAmountForChannelUri,
} from 'redux/selectors/claims';
import ChannelStakedIndicator from './view';

const select = (state, props) => ({
  channelClaim: makeSelectClaimForUri(props.uri)(state),
  amount: makeSelectTotalStakedAmountForChannelUri(props.uri)(state),
  level: makeSelectStakedLevelForChannelUri(props.uri)(state),
});

export default connect(select)(ChannelStakedIndicator);
