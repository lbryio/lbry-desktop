import { connect } from 'react-redux';
import { selectClaimForUri, selectTitleForUri } from 'redux/selectors/claims';
import ChannelTitle from './view';

const select = (state, props) => ({
  title: selectTitleForUri(state, props.uri),
  claim: selectClaimForUri(state, props.uri),
});

export default connect(select)(ChannelTitle);
