import { connect } from 'react-redux';
import { makeSelectClaimForUri, makeSelectFileInfoForUri, makeSelectThumbnailForUri, SETTINGS } from 'lbry-redux';
import { doChangeVolume, doChangeMute, doAnalyticsView, doAnalyticsBuffer } from 'redux/actions/app';
import { selectVolume, selectMute } from 'redux/selectors/app';
import { savePosition, clearPosition } from 'redux/actions/content';
import { makeSelectContentPositionForUri } from 'redux/selectors/content';
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
  // get the position that will be used to start the video at, if t variable or saved in state
  // TODO: save and load this position from the db so can be used in display and
  const position = urlParams.get('t') !== null ? urlParams.get('t') : makeSelectContentPositionForUri(props.uri)(state);
  const userId = selectUser(state) && selectUser(state).id;

  return {
    autoplayIfEmbedded: Boolean(autoplay),
    autoplaySetting: Boolean(makeSelectClientSetting(SETTINGS.AUTOPLAY)(state)),
    volume: selectVolume(state),
    muted: selectMute(state),
    videoPlaybackRate: makeSelectClientSetting(SETTINGS.VIDEO_PLAYBACK_RATE)(state),
    position: position,
    hasFileInfo: Boolean(makeSelectFileInfoForUri(props.uri)(state)),
    thumbnail: makeSelectThumbnailForUri(props.uri)(state),
    claim: makeSelectClaimForUri(props.uri)(state),
    homepageData: selectHomepageData(state),
    authenticated: selectUserVerifiedEmail(state),
    userId: userId,
    shareTelemetry: IS_WEB || selectDaemonSettings(state).share_usage_data,
  };
};

const perform = (dispatch) => ({
  changeVolume: (volume) => dispatch(doChangeVolume(volume)),
  savePosition: (uri, position) => dispatch(savePosition(uri, position)),
  clearPosition: (uri) => dispatch(clearPosition(uri)),
  changeMute: (muted) => dispatch(doChangeMute(muted)),
  doAnalyticsView: (uri, timeToStart) => dispatch(doAnalyticsView(uri, timeToStart)),
  doAnalyticsBuffer: (uri, bufferData, player) => dispatch(doAnalyticsBuffer(uri, bufferData, player)),
  claimRewards: () => dispatch(doClaimEligiblePurchaseRewards()),
  toggleVideoTheaterMode: () => dispatch(toggleVideoTheaterMode()),
  setVideoPlaybackRate: (rate) => dispatch(doSetClientSetting(SETTINGS.VIDEO_PLAYBACK_RATE, rate)),
});

export default withRouter(connect(select, perform)(VideoViewer));
