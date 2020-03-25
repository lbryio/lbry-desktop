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
  doFetchClaimListMine,
} from 'lbry-redux';
import LiquidateSupports from './view';

const select = (state, props) => ({
  balance: selectBalance(state),
  totalBalance: selectTotalBalance(state),
  claimsBalance: selectClaimsBalance(state) || 0,
  supportsBalance: selectSupportsBalance(state) || 0,
  tipsBalance: selectTipsBalance(state) || 0,
  claim: makeSelectClaimForUri(props.uri)(state),
  metadata: makeSelectMetadataForUri(props.uri)(state),
});

const perform = dispatch => ({
  abandonSupportForClaim: (claimId, keep, preview) => dispatch(doSupportAbandonForClaim(claimId, keep, preview)),
  fetchClaimListMine: () => dispatch(doFetchClaimListMine()),
});

export default connect(select, perform)(LiquidateSupports);
