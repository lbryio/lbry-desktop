import { connect } from 'react-redux';
import SelectChannel from './view';
import { selectMyChannelClaims } from 'lbry-redux';

const select = state => ({
  channels: selectMyChannelClaims(state),
});

export default connect(select)(SelectChannel);
