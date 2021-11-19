import { connect } from 'react-redux';
import { selectInsufficientCreditsForUri } from 'redux/selectors/content';
import { makeSelectClaimWasPurchased } from 'redux/selectors/claims';
import ClaimInsufficientCredits from './view';

const select = (state, props) => ({
  isInsufficientCredits: selectInsufficientCreditsForUri(state, props.uri),
  claimWasPurchased: makeSelectClaimWasPurchased(props.uri)(state),
});

export default connect(select)(ClaimInsufficientCredits);
