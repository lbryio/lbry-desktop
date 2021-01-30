import { connect } from 'react-redux';
import { makeSelectClaimForUri, doPrepareEdit } from 'lbry-redux';
import CreatorAnalytics from './view';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
});

const perform = dispatch => ({
  prepareEdit: channelName => dispatch(doPrepareEdit({ signing_channel: { name: channelName } })),
});

export default connect(select, perform)(CreatorAnalytics);
