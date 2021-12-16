import { connect } from 'react-redux';
import {
  selectBalance,
  selectTotalBalance,
  selectClaimsBalance,
  selectSupportsBalance,
  selectTipsBalance,
  selectAbandonClaimSupportError,
} from 'redux/selectors/wallet';

import { makeSelectClaimForUri } from 'redux/selectors/claims';
import { doSupportAbandonForClaim } from 'redux/actions/wallet';
import SupportsLiquidate from './view';

const select = (state, props) => ({
  balance: selectBalance(state),
  totalBalance: selectTotalBalance(state),
  claimsBalance: selectClaimsBalance(state) || undefined,
  supportsBalance: selectSupportsBalance(state) || undefined,
  tipsBalance: selectTipsBalance(state) || undefined,
  claim: makeSelectClaimForUri(props.uri)(state),
  abandonClaimError: selectAbandonClaimSupportError(state),
});

const perform = (dispatch) => ({
  abandonSupportForClaim: (claimId, type, keep, preview) =>
    dispatch(doSupportAbandonForClaim(claimId, type, keep, preview)),
});

export default connect(select, perform)(SupportsLiquidate);
