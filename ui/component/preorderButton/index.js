import { connect } from 'react-redux';
import {
  selectPreorderTagForUri,
  selectClaimForUri,
  selectClaimIsMine,
  selectPreorderContentClaimIdForUri,
  selectClaimForId,
  selectPurchaseTagForUri,
  selectPurchaseMadeForClaimId,
} from 'redux/selectors/claims';
import PreorderButton from './view';
import { doOpenModal } from 'redux/actions/app';
import * as SETTINGS from 'constants/settings';
import { selectClientSetting } from 'redux/selectors/settings';
import { doResolveClaimIds, doCheckIfPurchasedClaimId } from 'redux/actions/claims';

const select = (state, props) => {
  const claim = selectClaimForUri(state, props.uri);

  const preorderContentClaimId = selectPreorderContentClaimIdForUri(state, props.uri);

  return {
    preorderTag: selectPreorderTagForUri(state, props.uri),
    purchaseTag: selectPurchaseTagForUri(state, props.uri),
    claimIsMine: selectClaimIsMine(state, claim),
    claim,
    preferredCurrency: selectClientSetting(state, SETTINGS.PREFERRED_CURRENCY),
    preorderContentClaimId: selectPreorderContentClaimIdForUri(state, props.uri),
    preorderContentClaim: selectClaimForId(state, preorderContentClaimId),
    purchaseContentTag: selectPurchaseTagForUri(state, props.uri),
    purchaseMadeForClaimId: selectPurchaseMadeForClaimId(state, claim.claim_id),
  };
};

const perform = {
  doOpenModal,
  doResolveClaimIds,
  doCheckIfPurchasedClaimId,
};

export default connect(select, perform)(PreorderButton);
