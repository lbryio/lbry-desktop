import { connect } from 'react-redux';
import {
  selectClaimForUri,
  selectClaimWasPurchasedForUri,
  selectRentalTagForUri,
  selectPurchaseTagForUri,
  selectIsFiatPaidForUri,
  selectIsFetchingPurchases,
} from 'redux/selectors/claims';
import { selectCostInfoForUri, doFetchCostInfoForUri, selectFetchingCostInfoForUri } from 'lbryinc';
import FilePrice from './view';

const select = (state, props) => {
  const claim = selectClaimForUri(state, props.uri);

  return {
    claim,
    sdkPaid: selectClaimWasPurchasedForUri(state, props.uri),
    fiatPaid: selectIsFiatPaidForUri(state, props.uri),
    costInfo: selectCostInfoForUri(state, props.uri),
    fetching: selectFetchingCostInfoForUri(state, props.uri),
    rentalInfo: selectRentalTagForUri(state, props.uri),
    purchaseInfo: selectPurchaseTagForUri(state, props.uri),
    isFetchingPurchases: selectIsFetchingPurchases(state),
  };
};

export default connect(select, { doFetchCostInfoForUri })(FilePrice);
