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
  pending: makeSelectClaimIsPending(props.uri)(state),
  claim: makeSelectClaimForUri(props.uri)(state),
  obscureNsfw: !selectShowMatureContent(state),
  claimIsMine: makeSelectClaimIsMine(props.uri)(state),
  isResolvingUri: makeSelectIsUriResolving(props.uri)(state),
  thumbnail: makeSelectThumbnailForUri(props.uri)(state),
  title: makeSelectTitleForUri(props.uri)(state),
  nsfw: makeSelectClaimIsNsfw(props.uri)(state),
  blackListedOutpoints: selectBlackListedOutpoints(state),
  filteredOutpoints: selectFilteredOutpoints(state),
  blockedChannelUris: selectBlockedChannels(state),
  hasVisitedUri: makeSelectHasVisitedUri(props.uri)(state),
  channelIsBlocked: selectChannelIsBlocked(props.uri)(state),
  isSubscribed: makeSelectIsSubscribed(props.uri, true)(state),
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
