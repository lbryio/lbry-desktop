import { connect } from 'react-redux';
import { makeSelectInsufficientCreditsForUri } from 'redux/selectors/content';
import { makeSelectClaimWasPurchased } from 'redux/selectors/claims';
import ClaimInsufficientCredits from './view';

const select = (state, props) => ({
  isInsufficientCredits: makeSelectInsufficientCreditsForUri(props.uri)(state),
  claimWasPurchased: makeSelectClaimWasPurchased(props.uri)(state),
});

export default connect(select)(ClaimInsufficientCredits);
