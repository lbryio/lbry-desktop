import { connect } from 'react-redux';
import { makeSelectClaimForUri } from 'redux/selectors/claims';
import { withRouter } from 'react-router';
import AutoplayCountdown from './view';
import { selectModal } from 'redux/selectors/app';

/*
  AutoplayCountdown does not fetch it's own next content to play, it relies on <RecommendedContent> being rendered.
  This is dumb but I'm just the guy who noticed -kj
 */
const select = (state, props) => ({
  nextRecommendedClaim: makeSelectClaimForUri(props.nextRecommendedUri)(state),
  modal: selectModal(state),
});

export default withRouter(connect(select, null)(AutoplayCountdown));
