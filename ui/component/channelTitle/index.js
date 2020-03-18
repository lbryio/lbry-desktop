import { connect } from 'react-redux';
import { makeSelectClaimForUri, makeSelectTitleForUri } from 'lbry-redux';
import ChannelTitle from './view';

const select = (state, props) => ({
  title: makeSelectTitleForUri(props.uri)(state),
  claim: makeSelectClaimForUri(props.uri)(state),
});

export default connect(select)(ChannelTitle);
