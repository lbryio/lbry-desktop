import { connect } from 'react-redux';
import { makeSelectClaimForUri, makeSelectPendingAmountByUri, makeSelectClaimIsMine } from 'lbry-redux';
import FileSubtitle from './view';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  pendingAmount: makeSelectPendingAmountByUri(props.uri)(state),
  claimIsMine: makeSelectClaimIsMine(props.uri)(state),
});
export default connect(select)(FileSubtitle);
