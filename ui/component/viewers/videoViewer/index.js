import { connect } from 'react-redux';
import { makeSelectClaimForUri, makeSelectFileInfoForUri, makeSelectThumbnailForUri, SETTINGS } from 'lbry-redux';
import { doChangeVolume, doChangeMute, doAnalyticsView, doAnalyticsBuffer } from 'redux/actions/app';
import { selectVolume, selectMute } from 'redux/selectors/app';
import { savePosition, clearPosition } from 'redux/actions/content';
import { makeSelectContentPositionForUri } from 'redux/selectors/content';
import VideoViewer from './view';
import { withRouter } from 'react-router';
import { doClaimEligiblePurchaseRewards } from 'redux/actions/rewards';
import { makeSelectClientSetting, selectHomepageData } from 'redux/selectors/settings';
import { selectUserVerifiedEmail } from 'redux/selectors/user';

const select = (state, props) => {
  const { search } = props.location;
  const urlParams = new URLSearchParams(search);
  const autoplay = urlParams.get('autoplay');
  const position = urlParams.get('t') !== null ? urlParams.get('t') : makeSelectContentPositionForUri(props.uri)(state);

  return {
    autoplayIfEmbedded: Boolean(autoplay),
    autoplaySetting: Boolean(makeSelectClientSetting(SETTINGS.AUTOPLAY)(state)),
    volume: selectVolume(state),
    muted: selectMute(state),
    position: position,
    hasFileInfo: Boolean(makeSelectFileInfoForUri(props.uri)(state)),
    thumbnail: makeSelectThumbnailForUri(props.uri)(state),
    claim: makeSelectClaimForUri(props.uri)(state),
    homepageData: selectHomepageData(state),
    authenticated: selectUserVerifiedEmail(state),
  };
};

const perform = dispatch => ({
  changeVolume: volume => dispatch(doChangeVolume(volume)),
  savePosition: (uri, position) => dispatch(savePosition(uri, position)),
  clearPosition: uri => dispatch(clearPosition(uri)),
  changeMute: muted => dispatch(doChangeMute(muted)),
  doAnalyticsView: (uri, timeToStart) => dispatch(doAnalyticsView(uri, timeToStart)),
  doAnalyticsBuffer: (uri, bufferData) => dispatch(doAnalyticsBuffer(uri, bufferData)),
  claimRewards: () => dispatch(doClaimEligiblePurchaseRewards()),
});

export default withRouter(connect(select, perform)(VideoViewer));
