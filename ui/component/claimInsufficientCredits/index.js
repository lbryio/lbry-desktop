import { connect } from 'react-redux';
import { selectInsufficientCreditsForUri } from 'redux/selectors/content';
import { selectClaimWasPurchasedForUri } from 'redux/selectors/claims';
import ClaimInsufficientCredits from './view';

const select = (state, props) => ({
  isInsufficientCredits: selectInsufficientCreditsForUri(state, props.uri),
  claimWasPurchased: selectClaimWasPurchasedForUri(state, props.uri),
});

export default connect(select)(ClaimInsufficientCredits);
