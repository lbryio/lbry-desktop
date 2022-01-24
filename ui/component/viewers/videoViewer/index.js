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
  doAnalyticsView,
  doAnalyticsBuffer,
  doAnaltyicsPurchaseEvent,
} from 'redux/actions/app';
import { selectVolume, selectMute } from 'redux/selectors/app';
import { savePosition, clearPosition, doPlayUri, doSetPlayingUri } from 'redux/actions/content';
import { makeSelectContentPositionForUri, makeSelectIsPlayerFloating, selectPlayingUri } from 'redux/selectors/content';
import { selectRecommendedContentForUri } from 'redux/selectors/search';
import VideoViewer from './view';
import { withRouter } from 'react-router';
import { doClaimEligiblePurchaseRewards } from 'redux/actions/rewards';
import { selectDaemonSettings, makeSelectClientSetting, selectHomepageData } from 'redux/selectors/settings';
import { toggleVideoTheaterMode, toggleAutoplayNext, doSetClientSetting } from 'redux/actions/settings';
import { selectUser } from 'redux/selectors/user';

const select = (state, props) => {
  const { search } = props.location;
  const urlParams = new URLSearchParams(search);
  const uri = props.uri;
  // TODO: eventually this should be received from DB and not local state (https://github.com/lbryio/lbry-desktop/issues/6796)
  const position = urlParams.get('t') !== null ? urlParams.get('t') : makeSelectContentPositionForUri(uri)(state);
  const userId = selectUser(state) && selectUser(state).id;
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
    collectionId,
    nextRecommendedUri,
    previousListUri,
    isMarkdownOrComment,
    autoplayNext: makeSelectClientSetting(SETTINGS.AUTOPLAY_NEXT)(state),
    volume: selectVolume(state),
    muted: selectMute(state),
    videoPlaybackRate: makeSelectClientSetting(SETTINGS.VIDEO_PLAYBACK_RATE)(state),
    thumbnail: selectThumbnailForUri(state, uri),
    claim: makeSelectClaimForUri(uri)(state),
    homepageData: selectHomepageData(state),
    shareTelemetry: selectDaemonSettings(state).share_usage_data,
    isFloating: makeSelectIsPlayerFloating(props.location)(state),
    videoTheaterMode: makeSelectClientSetting(SETTINGS.VIDEO_THEATER_MODE)(state),
  };
};

const perform = (dispatch) => ({
  changeVolume: (volume) => dispatch(doChangeVolume(volume)),
  savePosition: (uri, position) => dispatch(savePosition(uri, position)),
  clearPosition: (uri) => dispatch(clearPosition(uri)),
  changeMute: (muted) => dispatch(doChangeMute(muted)),
  doAnalyticsView: (uri, timeToStart) => dispatch(doAnalyticsView(uri, timeToStart)),
  doAnalyticsBuffer: (uri, bufferData) => dispatch(doAnalyticsBuffer(uri, bufferData)),
  claimRewards: () => dispatch(doClaimEligiblePurchaseRewards()),
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
});

export default withRouter(connect(select, perform)(VideoViewer));
