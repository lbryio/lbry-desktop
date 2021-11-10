import { connect } from 'react-redux';
import { makeSelectClaimForUri, makeSelectMetadataForUri, selectClaimIsMineForUri } from 'redux/selectors/claims';
import { makeSelectPendingAmountByUri } from 'redux/selectors/wallet';
import { doOpenModal } from 'redux/actions/app';
import { selectUser } from 'redux/selectors/user';
import FileDescription from './view';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  claimIsMine: selectClaimIsMineForUri(state, props.uri),
  metadata: makeSelectMetadataForUri(props.uri)(state),
  user: selectUser(state),
  pendingAmount: makeSelectPendingAmountByUri(props.uri)(state),
});

export default connect(select, {
  doOpenModal,
})(FileDescription);
