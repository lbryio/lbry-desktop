import { connect } from 'react-redux';
import EmbedWrapperPage from './view';
import { selectClaimForUri, selectIsUriResolving } from 'redux/selectors/claims';
import { makeSelectStreamingUrlForUri } from 'redux/selectors/file_info';
import { doResolveUri } from 'redux/actions/claims';
import { buildURI } from 'util/lbryURI';
import { doPlayUri } from 'redux/actions/content';
import { selectShouldObscurePreviewForUri } from 'redux/selectors/content';
import { selectCostInfoForUri, doFetchCostInfoForUri, selectBlackListedOutpoints } from 'lbryinc';
import { doCommentSocketConnect, doCommentSocketDisconnect } from 'redux/actions/websocket';
import { doFetchActiveLivestreams, doFetchChannelLiveStatus } from 'redux/actions/livestream';
import { selectIsActiveLivestreamForUri, selectActiveLivestreams } from 'redux/selectors/livestream';
import { getThumbnailFromClaim, isStreamPlaceholderClaim } from 'util/claim';

const select = (state, props) => {
  const { match } = props;
  const { params } = match;
  const { claimName, claimId } = params;
  const uri = claimName ? buildURI({ claimName, claimId }) : '';

  const claim = selectClaimForUri(state, uri);
  const { canonical_url: canonicalUrl } = claim || {};

  return {
    uri,
    claim,
    costInfo: selectCostInfoForUri(state, uri),
    streamingUrl: makeSelectStreamingUrlForUri(uri)(state),
    isResolvingUri: selectIsUriResolving(state, uri),
    blackListedOutpoints: selectBlackListedOutpoints(state),
    isCurrentClaimLive: canonicalUrl && selectIsActiveLivestreamForUri(state, canonicalUrl),
    isLivestreamClaim: isStreamPlaceholderClaim(claim),
    activeLivestreams: selectActiveLivestreams(state),
    obscurePreview: selectShouldObscurePreviewForUri(state, uri),
    claimThumbnail: getThumbnailFromClaim(claim),
  };
};

const perform = {
  doResolveUri,
  doPlayUri,
  doFetchCostInfoForUri,
  doFetchChannelLiveStatus,
  doCommentSocketConnect,
  doCommentSocketDisconnect,
  doFetchActiveLivestreams,
};

export default connect(select, perform)(EmbedWrapperPage);
