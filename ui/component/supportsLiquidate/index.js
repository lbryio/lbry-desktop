import { connect } from 'react-redux';
import {
  selectBalance,
  selectTotalBalance,
  selectClaimsBalance,
  selectSupportsBalance,
  selectTipsBalance,
  makeSelectMetadataForUri,
  makeSelectClaimForUri,
  doSupportAbandonForClaim,
  selectAbandonClaimSupportError,
} from 'lbry-redux';
import SupportsLiquidate from './view';

const select = (state, props) => ({
  balance: selectBalance(state),
  totalBalance: selectTotalBalance(state),
  claimsBalance: selectClaimsBalance(state) || undefined,
  supportsBalance: selectSupportsBalance(state) || undefined,
  tipsBalance: selectTipsBalance(state) || undefined,
  claim: makeSelectClaimForUri(props.uri)(state),
  metadata: makeSelectMetadataForUri(props.uri)(state),
  abandonClaimError: selectAbandonClaimSupportError(state),
});

const perform = dispatch => ({
  abandonSupportForClaim: (claimId, type, keep, preview) =>
    dispatch(doSupportAbandonForClaim(claimId, type, keep, preview)),
});

export default connect(select, perform)(SupportsLiquidate);
