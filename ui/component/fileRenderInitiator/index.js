import { connect } from 'react-redux';
import { doPlayUri, doSetPlayingUri, doSetPrimaryUri } from 'redux/actions/content';
import {
  makeSelectFileInfoForUri,
  makeSelectThumbnailForUri,
  makeSelectClaimForUri,
  makeSelectStreamingUrlForUri,
  makeSelectClaimWasPurchased,
  SETTINGS,
  COLLECTIONS_CONSTS,
} from 'lbry-redux';
import { makeSelectCostInfoForUri } from 'lbryinc';
import { selectUserVerifiedEmail } from 'redux/selectors/user';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import { withRouter } from 'react-router';
import {
  makeSelectIsPlaying,
  makeSelectShouldObscurePreview,
  selectPlayingUri,
  makeSelectInsufficientCreditsForUri,
  makeSelectFileRenderModeForUri,
} from 'redux/selectors/content';
import FileRenderInitiator from './view';
import { doAnaltyicsPurchaseEvent } from 'redux/actions/app';

const select = (state, props) => {
  const { search } = props.location;
  const urlParams = new URLSearchParams(search);
  const collectionId = urlParams.get(COLLECTIONS_CONSTS.COLLECTION_ID);

  return {
    claimThumbnail: makeSelectThumbnailForUri(props.uri)(state),
    fileInfo: makeSelectFileInfoForUri(props.uri)(state),
    obscurePreview: makeSelectShouldObscurePreview(props.uri)(state),
    isPlaying: makeSelectIsPlaying(props.uri)(state),
    playingUri: selectPlayingUri(state),
    insufficientCredits: makeSelectInsufficientCreditsForUri(props.uri)(state),
    streamingUrl: makeSelectStreamingUrlForUri(props.uri)(state),
    autoplay: makeSelectClientSetting(SETTINGS.AUTOPLAY_MEDIA)(state),
    hasCostInfo: Boolean(makeSelectCostInfoForUri(props.uri)(state)),
    costInfo: makeSelectCostInfoForUri(props.uri)(state),
    renderMode: makeSelectFileRenderModeForUri(props.uri)(state),
    claim: makeSelectClaimForUri(props.uri)(state),
    claimWasPurchased: makeSelectClaimWasPurchased(props.uri)(state),
    authenticated: selectUserVerifiedEmail(state),
    collectionId,
  };
};

const perform = (dispatch) => ({
  play: (uri, collectionId) => {
    dispatch(doSetPrimaryUri(uri));
    dispatch(doSetPlayingUri({ uri, collectionId }));
    dispatch(doPlayUri(uri, undefined, undefined, (fileInfo) => dispatch(doAnaltyicsPurchaseEvent(fileInfo))));
  },
});

export default withRouter(connect(select, perform)(FileRenderInitiator));
