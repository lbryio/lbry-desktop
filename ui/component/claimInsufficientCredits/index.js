import { connect } from 'react-redux';
import { makeSelectInsufficientCreditsForUri } from 'redux/selectors/content';
import ClaimInsufficientCredits from './view';

const select = (state, props) => ({
  isInsufficientCredits: makeSelectInsufficientCreditsForUri(props.uri)(state),
});

export default connect(select)(ClaimInsufficientCredits);
