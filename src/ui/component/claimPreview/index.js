import * as PAGES from 'constants/pages';
import { connect } from 'react-redux';
import {
  doResolveUri,
  makeSelectClaimForUri,
  makeSelectIsUriResolving,
  makeSelectClaimIsMine,
  makeSelectClaimIsPending,
  makeSelectThumbnailForUri,
  makeSelectTitleForUri,
  makeSelectClaimIsNsfw,
  selectBlockedChannels,
  selectChannelIsBlocked,
  doClearPublish,
  doPrepareEdit,
} from 'lbry-redux';
import { selectBlackListedOutpoints, selectFilteredOutpoints } from 'lbryinc';
import { selectShowMatureContent } from 'redux/selectors/settings';
import { makeSelectHasVisitedUri } from 'redux/selectors/content';
import { makeSelectIsSubscribed } from 'redux/selectors/subscriptions';
import { push } from 'connected-react-router';

import ClaimPreview from './view';

const select = (state, props) => ({
  pending: props.uri && makeSelectClaimIsPending(props.uri)(state),
  claim: props.uri && makeSelectClaimForUri(props.uri)(state),
  obscureNsfw: !selectShowMatureContent(state),
  claimIsMine: props.uri && makeSelectClaimIsMine(props.uri)(state),
  isResolvingUri: props.uri && makeSelectIsUriResolving(props.uri)(state),
  thumbnail: props.uri && makeSelectThumbnailForUri(props.uri)(state),
  title: props.uri && makeSelectTitleForUri(props.uri)(state),
  nsfw: props.uri && makeSelectClaimIsNsfw(props.uri)(state),
  blackListedOutpoints: selectBlackListedOutpoints(state),
  filteredOutpoints: selectFilteredOutpoints(state),
  blockedChannelUris: selectBlockedChannels(state),
  hasVisitedUri: props.uri && makeSelectHasVisitedUri(props.uri)(state),
  channelIsBlocked: props.uri && selectChannelIsBlocked(props.uri)(state),
  isSubscribed: props.uri && makeSelectIsSubscribed(props.uri, true)(state),
});

const perform = dispatch => ({
  resolveUri: uri => dispatch(doResolveUri(uri)),
  beginPublish: name => {
    dispatch(doClearPublish());
    dispatch(doPrepareEdit({ name }));
    dispatch(push(`/$/${PAGES.PUBLISH}`));
  },
});

export default connect(
  select,
  perform
)(ClaimPreview);
