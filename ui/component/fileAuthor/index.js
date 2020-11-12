import { connect } from 'react-redux';
import { makeSelectChannelForClaimUri } from 'lbry-redux';
import FileAuthor from './view';

const select = (state, props) => ({
  channelUri: makeSelectChannelForClaimUri(props.uri)(state),
});

export default connect(select)(FileAuthor);
