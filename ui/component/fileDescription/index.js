import { connect } from 'react-redux';
import {
  selectClaimForUri,
  makeSelectMetadataForUri,
  selectClaimIsMine,
  makeSelectTagsForUri,
} from 'redux/selectors/claims';
import { makeSelectPendingAmountByUri } from 'redux/selectors/wallet';
import { doOpenModal } from 'redux/actions/app';
import FileDescription from './view';

const select = (state, props) => {
  const claim = selectClaimForUri(state, props.uri);

  return {
    claim,
    claimIsMine: selectClaimIsMine(state, claim),
    metadata: makeSelectMetadataForUri(props.uri)(state),
    pendingAmount: makeSelectPendingAmountByUri(props.uri)(state),
    tags: makeSelectTagsForUri(props.uri)(state),
  };
};

export default connect(select, {
  doOpenModal,
})(FileDescription);
