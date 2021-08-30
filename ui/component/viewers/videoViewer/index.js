import { connect } from 'react-redux';
import {
  makeSelectClaimForUri,
  makeSelectFileInfoForUri,
  makeSelectThumbnailForUri,
  SETTINGS,
  COLLECTIONS_CONSTS,
  makeSelectNextUrlForCollectionAndUrl,
} from 'lbry-redux';
import { doChangeVolume, doChangeMute, doAnalyticsView, doAnalyticsBuffer } from 'redux/actions/app';
import { selectVolume, selectMute } from 'redux/selectors/app';
import { savePosition, clearPosition, doPlayUri, doSetPlayingUri } from 'redux/actions/content';
import {
  makeSelectContentPositionForUri,
  makeSelectIsPlayerFloating,
  makeSelectNextUnplayedRecommended,
  selectPlayingUri,
} from 'redux/selectors/content';
import VideoViewer from './view';
import { withRouter } from 'react-router';
import { doClaimEligiblePurchaseRewards } from 'redux/actions/rewards';
import { selectDaemonSettings, makeSelectClientSetting, selectHomepageData } from 'redux/selectors/settings';
import { toggleVideoTheaterMode, doSetClientSetting } from 'redux/actions/settings';
import { selectUserVerifiedEmail, selectUser } from 'redux/selectors/user';

const select = (state, props) => {
  const { search } = props.location;
  const urlParams = new URLSearchParams(search);
  const autoplay = urlParams.get('autoplay');
  const uri = props.uri;
  // TODO: eventually this should be received from DB and not local state (https://github.com/lbryio/lbry-desktop/issues/6796)
  const position = urlParams.get('t') !== null ? urlParams.get('t') : makeSelectContentPositionForUri(uri)(state);
  const userId = selectUser(state) && selectUser(state).id;
  const playingUri = selectPlayingUri(state);
  const collectionId = urlParams.get(COLLECTIONS_CONSTS.COLLECTION_ID) || (playingUri && playingUri.collectionId);

  let nextRecommendedUri;
  if (collectionId && uri) {
    nextRecommendedUri = makeSelectNextUrlForCollectionAndUrl(collectionId, uri)(state);
  } else {
    nextRecommendedUri = makeSelectNextUnplayedRecommended(uri)(state);
  }

  return {
    autoplayIfEmbedded: Boolean(autoplay),
    autoplaySetting: Boolean(makeSelectClientSetting(SETTINGS.AUTOPLAY)(state)),
    volume: selectVolume(state),
    muted: selectMute(state),
    videoPlaybackRate: makeSelectClientSetting(SETTINGS.VIDEO_PLAYBACK_RATE)(state),
    position: position,
    hasFileInfo: Boolean(makeSelectFileInfoForUri(uri)(state)),
    thumbnail: makeSelectThumbnailForUri(uri)(state),
    claim: makeSelectClaimForUri(uri)(state),
    homepageData: selectHomepageData(state),
    authenticated: selectUserVerifiedEmail(state),
    userId: userId,
    shareTelemetry: IS_WEB || selectDaemonSettings(state).share_usage_data,
    isFloating: makeSelectIsPlayerFloating(props.location)(state),
    collectionId,
    nextRecommendedUri,
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
  setVideoPlaybackRate: (rate) => dispatch(doSetClientSetting(SETTINGS.VIDEO_PLAYBACK_RATE, rate)),
  doPlayUri: (uri) => dispatch(doPlayUri(uri)),
  doSetPlayingUri: (uri, collectionId) => dispatch(doSetPlayingUri({ uri, collectionId })),
});

export default withRouter(connect(select, perform)(VideoViewer));
