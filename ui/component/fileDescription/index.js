import { connect } from 'react-redux';
import { selectClaimForUri, makeSelectMetadataForUri, selectClaimIsMine } from 'redux/selectors/claims';
import { makeSelectPendingAmountByUri } from 'redux/selectors/wallet';
import { doOpenModal } from 'redux/actions/app';
import { selectUser } from 'redux/selectors/user';
import FileDescription from './view';

const select = (state, props) => {
  const claim = selectClaimForUri(state, props.uri);

  return {
    claim,
    claimIsMine: selectClaimIsMine(state, claim),
    metadata: makeSelectMetadataForUri(props.uri)(state),
    user: selectUser(state),
    pendingAmount: makeSelectPendingAmountByUri(props.uri)(state),
  };
};

export default connect(select, {
  doOpenModal,
})(FileDescription);
