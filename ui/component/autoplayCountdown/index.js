import { connect } from 'react-redux';
import { makeSelectClaimForUri, SETTINGS, COLLECTIONS_CONSTS, makeSelectNextUrlForCollectionAndUrl } from 'lbry-redux';
import { withRouter } from 'react-router';
import { makeSelectIsPlayerFloating, makeSelectNextUnplayedRecommended } from 'redux/selectors/content';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import { doSetPlayingUri, doPlayUri } from 'redux/actions/content';
import AutoplayCountdown from './view';
import { selectModal } from 'redux/selectors/app';

/*
  AutoplayCountdown does not fetch it's own next content to play, it relies on <RecommendedContent> being rendered.
  This is dumb but I'm just the guy who noticed -kj
 */
const select = (state, props) => {
  const { location } = props;
  const { search } = location;
  const urlParams = new URLSearchParams(search);
  const collectionId = urlParams.get(COLLECTIONS_CONSTS.COLLECTION_ID);

  let nextRecommendedUri;
  if (collectionId) {
    nextRecommendedUri = makeSelectNextUrlForCollectionAndUrl(collectionId, props.uri)(state);
  } else {
    nextRecommendedUri = makeSelectNextUnplayedRecommended(props.uri)(state);
  }

  return {
    collectionId,
    nextRecommendedUri,
    nextRecommendedClaim: makeSelectClaimForUri(nextRecommendedUri)(state),
    isFloating: makeSelectIsPlayerFloating(props.location)(state),
    autoplay: makeSelectClientSetting(SETTINGS.AUTOPLAY)(state),
    modal: selectModal(state),
  };
};

export default withRouter(
  connect(select, {
    doSetPlayingUri,
    doPlayUri,
  })(AutoplayCountdown)
);
