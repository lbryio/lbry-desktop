import { connect } from 'react-redux';
import {
  makeSelectClaimForUri,
  makeSelectIsUriResolving,
  makeSelectThumbnailForUri,
  makeSelectTitleForUri,
  makeSelectChannelForClaimUri,
  makeSelectClaimIsNsfw,
  makeSelectClaimIsStreamPlaceholder,
  makeSelectDateForUri,
} from 'redux/selectors/claims';
import { doFileGet } from 'redux/actions/file';
import { doResolveUri } from 'redux/actions/claims';
import { selectMutedChannels } from 'redux/selectors/blocked';
import { makeSelectViewCountForUri, selectBlackListedOutpoints, selectFilteredOutpoints } from 'lbryinc';
import { makeSelectIsActiveLivestream } from 'redux/selectors/livestream';
import { selectShowMatureContent } from 'redux/selectors/settings';
import ClaimPreviewTile from './view';
import formatMediaDuration from 'util/formatMediaDuration';

const select = (state, props) => {
  const claim = props.uri && makeSelectClaimForUri(props.uri)(state);
  const media = claim && claim.value && (claim.value.video || claim.value.audio);
  const mediaDuration = media && media.duration && formatMediaDuration(media.duration, { screenReader: true });

  return {
    claim,
    mediaDuration,
    date: props.uri && makeSelectDateForUri(props.uri)(state),
    channel: props.uri && makeSelectChannelForClaimUri(props.uri)(state),
    isResolvingUri: props.uri && makeSelectIsUriResolving(props.uri)(state),
    thumbnail: props.uri && makeSelectThumbnailForUri(props.uri)(state),
    title: props.uri && makeSelectTitleForUri(props.uri)(state),
    blackListedOutpoints: selectBlackListedOutpoints(state),
    filteredOutpoints: selectFilteredOutpoints(state),
    blockedChannelUris: selectMutedChannels(state),
    showMature: selectShowMatureContent(state),
    isMature: makeSelectClaimIsNsfw(props.uri)(state),
    isLivestream: makeSelectClaimIsStreamPlaceholder(props.uri)(state),
    isLivestreamActive: makeSelectIsActiveLivestream(props.uri)(state),
    viewCount: makeSelectViewCountForUri(props.uri)(state),
  };
};

const perform = (dispatch) => ({
  resolveUri: (uri) => dispatch(doResolveUri(uri)),
  getFile: (uri) => dispatch(doFileGet(uri, false)),
});

export default connect(select, perform)(ClaimPreviewTile);
