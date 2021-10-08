import { connect } from 'react-redux';
import { makeSelectChannelForClaimUri } from 'redux/selectors/claims';
import ClaimAuthor from './view';

const select = (state, props) => ({
  channelUri: makeSelectChannelForClaimUri(props.uri)(state),
});

export default connect(select)(ClaimAuthor);
