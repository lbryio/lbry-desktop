import * as SETTINGS from 'constants/settings';
import { connect } from 'react-redux';
import { makeSelectFileInfoForUri, makeSelectTitleForUri } from 'lbry-redux';
import {
  makeSelectIsPlaying,
  makeSelectIsPlayerFloating,
  selectPlayingUri,
  makeSelectFileRenderModeForUri,
  makeSelectStreamingUrlForUriWebProxy,
} from 'redux/selectors/content';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import { doSetPlayingUri } from 'redux/actions/content';
import { withRouter } from 'react-router';
import FileRenderFloating from './view';

const select = (state, props) => {
  const uri = selectPlayingUri(state);
  return {
    uri,
    title: makeSelectTitleForUri(uri)(state),
    fileInfo: makeSelectFileInfoForUri(uri)(state),
    isPlaying: makeSelectIsPlaying(uri)(state),
    isFloating: makeSelectIsPlayerFloating(props.location)(state),
    streamingUrl: makeSelectStreamingUrlForUriWebProxy(uri)(state),
    floatingPlayerEnabled: makeSelectClientSetting(SETTINGS.FLOATING_PLAYER)(state),
    renderMode: makeSelectFileRenderModeForUri(uri)(state),
  };
};

const perform = dispatch => ({
  clearPlayingUri: () => dispatch(doSetPlayingUri(null)),
});

export default withRouter(connect(select, perform)(FileRenderFloating));
