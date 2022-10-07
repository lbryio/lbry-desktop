import { connect } from 'react-redux';
import ProtectedContentOverlay from './view';
import { selectClaimForUri, selectClaimIsMine, selectProtectedContentTagForUri } from 'redux/selectors/claims';
import {
  selectMyProtectedContentMembershipForId,
  selectUserIsMemberOfProtectedContentForId,
  selectPriceOfCheapestPlanForClaimId,
} from 'redux/selectors/memberships';
import { doOpenModal } from 'redux/actions/app';

const select = (state, props) => {
  const claim = selectClaimForUri(state, props.uri);
  const claimId = claim && claim.claim_id;

  return {
    claimIsMine: selectClaimIsMine(state, claim),
    claim,
    isProtected: Boolean(selectProtectedContentTagForUri(state, props.uri)),
    userIsAMember: selectUserIsMemberOfProtectedContentForId(state, claimId),
    myMembership: selectMyProtectedContentMembershipForId(state, claimId),
    cheapestPlanPrice: selectPriceOfCheapestPlanForClaimId(state, claimId),
  };
};

const perform = {
  doOpenModal,
};

export default connect(select, perform)(ProtectedContentOverlay);
