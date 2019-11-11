import { connect } from 'react-redux';
import { makeSelectClaimForUri } from 'lbry-redux';
import SocialShare from './view';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
});

export default connect(select)(SocialShare);
