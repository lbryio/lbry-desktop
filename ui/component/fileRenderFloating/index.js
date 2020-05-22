import * as SETTINGS from 'constants/settings';
import { connect } from 'react-redux';
import { makeSelectFileInfoForUri, makeSelectTitleForUri, makeSelectStreamingUrlForUri } from 'lbry-redux';
import {
  makeSelectIsPlayerFloating,
  selectFloatingUri,
  selectPlayingUri,
  makeSelectFileRenderModeForUri,
} from 'redux/selectors/content';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import { doCloseFloatingPlayer, doSetPlayingUri } from 'redux/actions/content';
import { withRouter } from 'react-router';
import FileRenderFloating from './view';

const select = (state, props) => {
  const floatingUri = selectFloatingUri(state);
  const playingUri = selectPlayingUri(state);
  const uri = floatingUri || playingUri;
  return {
    uri,
    title: makeSelectTitleForUri(uri)(state),
    fileInfo: makeSelectFileInfoForUri(uri)(state),
    isFloating: makeSelectIsPlayerFloating(props.location)(state),
    streamingUrl: makeSelectStreamingUrlForUri(uri)(state),
    floatingPlayerEnabled: makeSelectClientSetting(SETTINGS.FLOATING_PLAYER)(state),
    renderMode: makeSelectFileRenderModeForUri(uri)(state),
  };
};

const perform = dispatch => ({
  closeFloatingPlayer: () => dispatch(doCloseFloatingPlayer(null)),
  setPlayingUri: uri => dispatch(doSetPlayingUri(uri)),
});

export default withRouter(connect(select, perform)(FileRenderFloating));
