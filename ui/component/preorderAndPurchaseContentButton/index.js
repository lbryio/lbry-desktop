import { connect } from 'react-redux';
import {
  selectPreorderTagForUri,
  selectClaimForUri,
  selectClaimIsMine,
  selectPreorderContentClaimIdForUri,
  selectClaimForId,
  selectPurchaseTagForUri,
  selectPurchaseMadeForClaimId,
  selectRentalTagForUri,
  selectValidRentalPurchaseForClaimId,
} from 'redux/selectors/claims';
import PreorderAndPurchaseButton from './view';
import { doOpenModal } from 'redux/actions/app';
import { selectPreferredCurrency } from 'redux/selectors/settings';
import { doResolveClaimIds } from 'redux/actions/claims';
import { selectCanReceiveFiatTipsForUri } from 'redux/selectors/stripe';
import { doTipAccountCheckForUri, doCheckIfPurchasedClaimId } from 'redux/actions/stripe';

const select = (state, props) => {
  const { uri } = props;
  const claim = selectClaimForUri(state, uri);

  const preorderContentClaimId = selectPreorderContentClaimIdForUri(state, uri);

  return {
    claim,
    claimIsMine: selectClaimIsMine(state, claim),
    preferredCurrency: selectPreferredCurrency(state),
    preorderContentClaim: selectClaimForId(state, preorderContentClaimId),
    preorderContentClaimId: selectPreorderContentClaimIdForUri(state, uri),
    preorderTag: selectPreorderTagForUri(state, uri),
    purchaseContentTag: selectPurchaseTagForUri(state, uri),
    purchaseMadeForClaimId: selectPurchaseMadeForClaimId(state, claim.claim_id),
    purchaseTag: selectPurchaseTagForUri(state, uri),
    rentalTag: selectRentalTagForUri(state, uri),
    validRentalPurchase: selectValidRentalPurchaseForClaimId(state, claim.claim_id),
    canReceiveFiatTips: selectCanReceiveFiatTipsForUri(state, uri),
  };
};

const perform = {
  doOpenModal,
  doResolveClaimIds,
  doCheckIfPurchasedClaimId,
  doTipAccountCheckForUri,
};

export default connect(select, perform)(PreorderAndPurchaseButton);
