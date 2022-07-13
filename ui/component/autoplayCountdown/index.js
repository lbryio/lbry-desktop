import { connect } from 'react-redux';
import { makeSelectClaimForUri, selectClaimIsNsfwForUri } from 'redux/selectors/claims';
import AutoplayCountdown from './view';
import { selectModal } from 'redux/selectors/app';
import { doOpenModal } from 'redux/actions/app';

/*
  AutoplayCountdown does not fetch it's own next content to play, it relies on <RecommendedContent> being rendered.
  This is dumb but I'm just the guy who noticed -kj
 */
const select = (state, props) => ({
  nextRecommendedClaim: makeSelectClaimForUri(props.nextRecommendedUri)(state),
  modal: selectModal(state),
  isMature: selectClaimIsNsfwForUri(state, props.uri),
});

const perform = {
  doOpenModal,
};

export default connect(select, perform)(AutoplayCountdown);
