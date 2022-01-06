import { connect } from 'react-redux';
import { makeSelectClaimForUri, selectThumbnailForUri } from 'redux/selectors/claims';
import {
  makeSelectNextUrlForCollectionAndUrl,
  makeSelectPreviousUrlForCollectionAndUrl,
} from 'redux/selectors/collections';
import * as SETTINGS from 'constants/settings';
import * as COLLECTIONS_CONSTS from 'constants/collections';
import {
  doChangeVolume,
  doChangeMute,
  doAnalyticsBuffer,
  doAnaltyicsPurchaseEvent,
  doAnalyticsView,
} from 'redux/actions/app';
import { selectVolume, selectMute } from 'redux/selectors/app';
import { savePosition, clearPosition, doPlayUri, doSetPlayingUri } from 'redux/actions/content';
import { makeSelectContentPositionForUri, makeSelectIsPlayerFloating, selectPlayingUri } from 'redux/selectors/content';
import { selectRecommendedContentForUri } from 'redux/selectors/search';
import VideoViewer from './view';
import { withRouter } from 'react-router';
import { doClaimEligiblePurchaseRewards } from 'redux/actions/rewards';
import { selectDaemonSettings, selectClientSetting, selectHomepageData } from 'redux/selectors/settings';
import { toggleVideoTheaterMode, toggleAutoplayNext, doSetClientSetting } from 'redux/actions/settings';
import { selectUserVerifiedEmail, selectUser } from 'redux/selectors/user';

const select = (state, props) => {
  const { search } = props.location;
  const urlParams = new URLSearchParams(search);
  const autoplay = urlParams.get('autoplay');
  const uri = props.uri;

  // TODO: eventually this should be received from DB and not local state (https://github.com/lbryio/lbry-desktop/issues/6796)
  const position = urlParams.get('t') !== null ? urlParams.get('t') : makeSelectContentPositionForUri(uri)(state);
  const userId = selectUser(state) && selectUser(state).id;
  const internalFeature = selectUser(state) && selectUser(state).internal_feature;
  const playingUri = selectPlayingUri(state);
  const collectionId = urlParams.get(COLLECTIONS_CONSTS.COLLECTION_ID) || (playingUri && playingUri.collectionId);
  const isMarkdownOrComment = playingUri && (playingUri.source === 'markdown' || playingUri.source === 'comment');

  let nextRecommendedUri;
  let previousListUri;
  if (collectionId) {
    nextRecommendedUri = makeSelectNextUrlForCollectionAndUrl(collectionId, uri)(state);
    previousListUri = makeSelectPreviousUrlForCollectionAndUrl(collectionId, uri)(state);
  } else {
    const recommendedContent = selectRecommendedContentForUri(state, uri);
    nextRecommendedUri = recommendedContent && recommendedContent[0];
  }

  return {
    position,
    userId,
    internalFeature,
    collectionId,
    nextRecommendedUri,
    previousListUri,
    isMarkdownOrComment,
    autoplayIfEmbedded: Boolean(autoplay),
    autoplayNext: selectClientSetting(state, SETTINGS.AUTOPLAY_NEXT),
    volume: selectVolume(state),
    muted: selectMute(state),
    videoPlaybackRate: selectClientSetting(state, SETTINGS.VIDEO_PLAYBACK_RATE),
    thumbnail: selectThumbnailForUri(state, uri),
    claim: makeSelectClaimForUri(uri)(state),
    homepageData: selectHomepageData(state),
    authenticated: selectUserVerifiedEmail(state),
    shareTelemetry: IS_WEB || selectDaemonSettings(state).share_usage_data,
    isFloating: makeSelectIsPlayerFloating(props.location)(state),
    videoTheaterMode: selectClientSetting(state, SETTINGS.VIDEO_THEATER_MODE),
  };
};

const perform = (dispatch) => ({
  changeVolume: (volume) => dispatch(doChangeVolume(volume)),
  savePosition: (uri, position) => dispatch(savePosition(uri, position)),
  clearPosition: (uri) => dispatch(clearPosition(uri)),
  changeMute: (muted) => dispatch(doChangeMute(muted)),
  doAnalyticsBuffer: (uri, bufferData) => dispatch(doAnalyticsBuffer(uri, bufferData)),
  toggleVideoTheaterMode: () => dispatch(toggleVideoTheaterMode()),
  toggleAutoplayNext: () => dispatch(toggleAutoplayNext()),
  setVideoPlaybackRate: (rate) => dispatch(doSetClientSetting(SETTINGS.VIDEO_PLAYBACK_RATE, rate)),
  doPlayUri: (uri, collectionId) =>
    dispatch(
      doPlayUri(
        uri,
        false,
        false,
        (fileInfo) => {
          dispatch(doAnaltyicsPurchaseEvent(fileInfo));
        },
        true
      ),
      dispatch(doSetPlayingUri({ uri, collectionId }))
    ),
  doAnalyticsView: (uri, timeToStart) => dispatch(doAnalyticsView(uri, timeToStart)),
  claimRewards: () => dispatch(doClaimEligiblePurchaseRewards()),
});

export default withRouter(connect(select, perform)(VideoViewer));
