import { connect } from 'react-redux';
import {
  makeSelectFileInfoForUri,
  makeSelectTitleForUri,
  makeSelectStreamingUrlForUri,
  makeSelectClaimIsNsfw,
  SETTINGS,
} from 'lbry-redux';
import {
  makeSelectIsPlayerFloating,
  selectPrimaryUri,
  selectPlayingUri,
  makeSelectFileRenderModeForUri,
} from 'redux/selectors/content';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import { doSetPlayingUri } from 'redux/actions/content';
import { doFetchRecommendedContent } from 'redux/actions/search';
import { withRouter } from 'react-router';
import FileRenderFloating from './view';

const select = (state, props) => {
  const playingUri = selectPlayingUri(state);
  const primaryUri = selectPrimaryUri(state);
  const uri = playingUri && playingUri.uri;

  return {
    uri,
    primaryUri,
    playingUri,
    title: makeSelectTitleForUri(uri)(state),
    fileInfo: makeSelectFileInfoForUri(uri)(state),
    mature: makeSelectClaimIsNsfw(props.uri)(state),
    isFloating: makeSelectIsPlayerFloating(props.location)(state),
    streamingUrl: makeSelectStreamingUrlForUri(uri)(state),
    floatingPlayerEnabled: makeSelectClientSetting(SETTINGS.FLOATING_PLAYER)(state),
    renderMode: makeSelectFileRenderModeForUri(uri)(state),
    videoTheaterMode: makeSelectClientSetting(SETTINGS.VIDEO_THEATER_MODE)(state),
  };
};

const perform = (dispatch) => ({
  closeFloatingPlayer: () => dispatch(doSetPlayingUri({ uri: null })),
  doFetchRecommendedContent: (uri, mature) => dispatch(doFetchRecommendedContent(uri, mature)),
});

export default withRouter(connect(select, perform)(FileRenderFloating));
