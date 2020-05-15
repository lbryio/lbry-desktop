import { connect } from 'react-redux';
import { makeSelectClaimForUri, makeSelectFileInfoForUri, makeSelectThumbnailForUri } from 'lbry-redux';
import { doChangeVolume, doChangeMute, doAnalyticsView } from 'redux/actions/app';
import { selectVolume, selectMute } from 'redux/selectors/app';
import { savePosition, clearPosition } from 'redux/actions/content';
import { makeSelectContentPositionForUri } from 'redux/selectors/content';
import VideoViewer from './view';
import { withRouter } from 'react-router';
import { doClaimEligiblePurchaseRewards } from 'lbryinc';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import * as SETTINGS from 'constants/settings';

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
  };
};

const perform = dispatch => ({
  changeVolume: volume => dispatch(doChangeVolume(volume)),
  savePosition: (uri, position) => dispatch(savePosition(uri, position)),
  clearPosition: uri => dispatch(clearPosition(uri)),
  changeMute: muted => dispatch(doChangeMute(muted)),
  doAnalyticsView: (uri, timeToStart) => dispatch(doAnalyticsView(uri, timeToStart)),
  claimRewards: () => dispatch(doClaimEligiblePurchaseRewards()),
});

export default withRouter(connect(select, perform)(VideoViewer));
