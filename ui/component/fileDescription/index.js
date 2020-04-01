import { connect } from 'react-redux';
import { makeSelectClaimForUri, makeSelectMetadataForUri } from 'lbry-redux';
import { selectUser } from 'lbryinc';
import FileDescription from './view';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  metadata: makeSelectMetadataForUri(props.uri)(state),
  user: selectUser(state),
});

export default connect(select, null)(FileDescription);
