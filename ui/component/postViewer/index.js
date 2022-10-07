import { connect } from 'react-redux';
import { selectClaimForUri, selectClaimIsMineForUri } from 'redux/selectors/claims';
import { selectNoRestrictionOrUserIsMemberForContentClaimId } from 'redux/selectors/memberships';
import PostViewer from './view';
import { doOpenModal } from 'redux/actions/app';

const select = (state, props) => {
  const { uri } = props;
  const claim = selectClaimForUri(state, uri);

  return {
    claim,
    claimIsMine: selectClaimIsMineForUri(state, uri),
    contentUnlocked: claim && selectNoRestrictionOrUserIsMemberForContentClaimId(state, claim.claim_id),
  };
};

export default connect(select, {
  doOpenModal,
})(PostViewer);
