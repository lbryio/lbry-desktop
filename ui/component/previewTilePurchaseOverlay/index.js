import { connect } from 'react-redux';
import {
  selectPreorderTagForUri,
  selectPurchaseTagForUri,
  selectPreorderContentClaimIdForUri,
  selectRentalTagForUri,
} from 'redux/selectors/claims';
import { selectClientSetting } from 'redux/selectors/settings';
import * as SETTINGS from 'constants/settings';

import PreviewTilePurchaseOverlay from './view';

const select = (state, props) => {
  return {
    preorderTag: selectPreorderTagForUri(state, props.uri),
    purchaseTag: selectPurchaseTagForUri(state, props.uri),
    rentalTag: selectRentalTagForUri(state, props.uri),
    preorderContentClaimId: selectPreorderContentClaimIdForUri(state, props.uri),
    preferredCurrency: selectClientSetting(state, SETTINGS.PREFERRED_CURRENCY),
  };
};

export default connect(select, null)(PreviewTilePurchaseOverlay);
