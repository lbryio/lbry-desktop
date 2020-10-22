import { connect } from 'react-redux';
import {
  makeSelectClaimForUri,
  makeSelectMetadataForUri,
  makeSelectTagsForUri,
  makeSelectPendingAmountByUri,
} from 'lbry-redux';
import { selectUser } from 'redux/selectors/user';
import FileDescription from './view';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  metadata: makeSelectMetadataForUri(props.uri)(state),
  user: selectUser(state),
  tags: makeSelectTagsForUri(props.uri)(state),
  pendingAmount: makeSelectPendingAmountByUri(props.uri)(state),
});

export default connect(select, null)(FileDescription);
