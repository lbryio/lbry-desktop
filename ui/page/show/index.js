import * as PAGES from 'constants/pages';
import { DOMAIN } from 'config';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { PAGE_SIZE } from 'constants/claim';
import {
  doResolveUri,
  makeSelectClaimForUri,
  makeSelectIsUriResolving,
  makeSelectTotalPagesForChannel,
  makeSelectTitleForUri,
  normalizeURI,
  makeSelectClaimIsMine,
  makeSelectClaimIsPending,
  makeSelectClaimIsStreamPlaceholder,
  doClearPublish,
  doPrepareEdit,
  doFetchItemsInCollection,
  makeSelectCollectionForId,
  makeSelectUrlsForCollectionId,
  makeSelectIsResolvingCollectionForId,
  COLLECTIONS_CONSTS,
} from 'lbry-redux';
import { push } from 'connected-react-router';
import { makeSelectChannelInSubscriptions } from 'redux/selectors/subscriptions';
import { selectBlackListedOutpoints } from 'lbryinc';
import ShowPage from './view';

const select = (state, props) => {
  const { pathname, hash, search } = props.location;
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
      props.history.replace(`/`);
    } else if (!path.startsWith('$/') && match && match.index) {
      uri = `lbry://${path.slice(0, match.index)}`;
      props.history.replace(`/${path.slice(0, match.index)}`);
    }
  }
  const claim = makeSelectClaimForUri(uri)(state);
  const collectionId =
    urlParams.get(COLLECTIONS_CONSTS.COLLECTION_ID) ||
    (claim && claim.value_type === 'collection' && claim.claim_id) ||
    null;

  return {
    uri,
    claim,
    isResolvingUri: makeSelectIsUriResolving(uri)(state),
    blackListedOutpoints: selectBlackListedOutpoints(state),
    totalPages: makeSelectTotalPagesForChannel(uri, PAGE_SIZE)(state),
    isSubscribed: makeSelectChannelInSubscriptions(uri)(state),
    title: makeSelectTitleForUri(uri)(state),
    claimIsMine: makeSelectClaimIsMine(uri)(state),
    claimIsPending: makeSelectClaimIsPending(uri)(state),
    isLivestream: makeSelectClaimIsStreamPlaceholder(uri)(state),
    collection: makeSelectCollectionForId(collectionId)(state),
    collectionId: collectionId,
    collectionUrls: makeSelectUrlsForCollectionId(collectionId)(state),
    isResolvingCollection: makeSelectIsResolvingCollectionForId(collectionId)(state),
  };
};

const perform = (dispatch) => ({
  resolveUri: (uri) => dispatch(doResolveUri(uri)),
  beginPublish: (name) => {
    dispatch(doClearPublish());
    dispatch(doPrepareEdit({ name }));
    dispatch(push(`/$/${PAGES.UPLOAD}`));
  },
  fetchCollectionItems: (claimId) => dispatch(doFetchItemsInCollection({ collectionId: claimId })),
});

export default withRouter(connect(select, perform)(ShowPage));
