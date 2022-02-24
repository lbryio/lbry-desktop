import { DOMAIN } from 'config';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { PAGE_SIZE } from 'constants/claim';
import {
  selectClaimForUri,
  selectIsUriResolving,
  makeSelectTotalPagesForChannel,
  selectTitleForUri,
  selectClaimIsMine,
  makeSelectClaimIsPending,
  selectIsStreamPlaceholderForUri,
} from 'redux/selectors/claims';
import {
  makeSelectCollectionForId,
  makeSelectUrlsForCollectionId,
  makeSelectIsResolvingCollectionForId,
} from 'redux/selectors/collections';
import { doResolveUri } from 'redux/actions/claims';
import { doBeginPublish } from 'redux/actions/publish';
import { doFetchItemsInCollection } from 'redux/actions/collections';
import { normalizeURI } from 'util/lbryURI';
import * as COLLECTIONS_CONSTS from 'constants/collections';
import { selectIsSubscribedForUri } from 'redux/selectors/subscriptions';
import { selectBlacklistedOutpointMap } from 'lbryinc';
import { doAnalyticsView } from 'redux/actions/app';
import ShowPage from './view';

const select = (state, props) => {
  const { location, history } = props;
  const { pathname, hash, search } = location;

  const urlPath = pathname + hash;
  const urlParams = new URLSearchParams(search);

  // Remove the leading "/" added by the browser
  let path = urlPath.slice(1).replace(/:/g, '#');

  // Google cache url
  // ex: webcache.googleusercontent.com/search?q=cache:MLwN3a8fCbYJ:https://lbry.tv/%40Bombards_Body_Language:f+&cd=12&hl=en&ct=clnk&gl=us
  // Extract the lbry url and use that instead
  // Without this it will try to render lbry://search
  if (search && search.startsWith('?q=cache:')) {
    const googleCacheRegex = new RegExp(`(https://${DOMAIN}/)([^+]*)`);
    const [x, y, googleCachedUrl] = search.match(googleCacheRegex); // eslint-disable-line
    if (googleCachedUrl) {
      const actualUrl = decodeURIComponent(googleCachedUrl);
      if (actualUrl) {
        path = actualUrl.replace(/:/g, '#');
      }
    }
  }

  let uri;
  try {
    uri = normalizeURI(path);
  } catch (e) {
    const match = path.match(/[#/:]/);

    if (path === '$/') {
      history.replace(`/`);
    } else if (!path.startsWith('$/') && match && match.index) {
      uri = `lbry://${path.slice(0, match.index)}`;
      history.replace(`/${path.slice(0, match.index)}`);
    }
  }

  const claim = selectClaimForUri(state, uri);
  const collectionId =
    urlParams.get(COLLECTIONS_CONSTS.COLLECTION_ID) ||
    (claim && claim.value_type === 'collection' && claim.claim_id) ||
    null;

  return {
    uri,
    claim,
    isResolvingUri: selectIsUriResolving(state, uri),
    blackListedOutpointMap: selectBlacklistedOutpointMap(state),
    totalPages: makeSelectTotalPagesForChannel(uri, PAGE_SIZE)(state),
    isSubscribed: selectIsSubscribedForUri(state, uri),
    title: selectTitleForUri(state, uri),
    claimIsMine: selectClaimIsMine(state, claim),
    claimIsPending: makeSelectClaimIsPending(uri)(state),
    isLivestream: selectIsStreamPlaceholderForUri(state, uri),
    collection: makeSelectCollectionForId(collectionId)(state),
    collectionId,
    collectionUrls: makeSelectUrlsForCollectionId(collectionId)(state),
    isResolvingCollection: makeSelectIsResolvingCollectionForId(collectionId)(state),
  };
};

const perform = {
  doResolveUri,
  doBeginPublish,
  doFetchItemsInCollection,
  doAnalyticsView,
};

export default withRouter(connect(select, perform)(ShowPage));
