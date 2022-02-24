// @flow
import { DOMAIN, ENABLE_NO_SOURCE_CLAIMS } from 'config';
import * as PAGES from 'constants/pages';
import React, { useEffect, useState } from 'react';
import { lazyImport } from 'util/lazyImport';
import { Redirect, useHistory } from 'react-router-dom';
import Spinner from 'component/spinner';
import ChannelPage from 'page/channel';
import Page from 'component/page';
import Button from 'component/button';
import Card from 'component/common/card';
import Yrbl from 'component/yrbl';
import { formatLbryUrlForWeb } from 'util/url';
import { parseURI } from 'util/lbryURI';
import * as COLLECTIONS_CONSTS from 'constants/collections';

const AbandonedChannelPreview = lazyImport(() =>
  import('component/abandonedChannelPreview' /* webpackChunkName: "abandonedChannelPreview" */)
);
const FilePage = lazyImport(() => import('page/file' /* webpackChunkName: "filePage" */));
const LivestreamPage = lazyImport(() => import('page/livestream' /* webpackChunkName: "livestream" */));
const isDev = process.env.NODE_ENV !== 'production';

type Props = {
  isResolvingUri: boolean,
  isSubscribed: boolean,
  uri: string,
  claim: StreamClaim,
  location: UrlLocation,
  blackListedOutpointMap: { [string]: number },
  title: string,
  claimIsMine: boolean,
  claimIsPending: boolean,
  isLivestream: boolean,
  collectionId: string,
  collection: Collection,
  collectionUrls: Array<string>,
  isResolvingCollection: boolean,
  doResolveUri: (uri: string, returnCached: boolean, resolveReposts: boolean, options: any) => void,
  doBeginPublish: (name: ?string) => void,
  doFetchItemsInCollection: ({ collectionId: string }) => void,
  doAnalyticsView: (uri: string) => void,
};

export default function ShowPage(props: Props) {
  const {
    isResolvingUri,
    uri,
    claim,
    blackListedOutpointMap,
    location,
    claimIsMine,
    isSubscribed,
    claimIsPending,
    isLivestream,
    collectionId,
    collection,
    collectionUrls,
    isResolvingCollection,
    doResolveUri,
    doBeginPublish,
    doFetchItemsInCollection,
    doAnalyticsView,
  } = props;

  const { push } = useHistory();
  const { search, pathname, hash } = location;
  const urlParams = new URLSearchParams(search);
  const linkedCommentId = urlParams.get('lc');

  const signingChannel = claim && claim.signing_channel;
  const canonicalUrl = claim && claim.canonical_url;
  const claimExists = claim !== null && claim !== undefined;
  const haventFetchedYet = claim === undefined;
  const isMine = claim && claim.is_my_output;

  const { contentName, isChannel } = parseURI(uri); // deprecated contentName - use streamName and channelName
  const isCollection = claim && claim.value_type === 'collection';
  const resolvedCollection = collection && collection.id; // not null
  const showLiveStream = isLivestream && ENABLE_NO_SOURCE_CLAIMS;
  const isClaimBlackListed =
    claim &&
    blackListedOutpointMap &&
    Boolean(
      (signingChannel && blackListedOutpointMap[`${signingChannel.txid}:${signingChannel.nout}`]) ||
        blackListedOutpointMap[`${claim.txid}:${claim.nout}`]
    );

  // changed this from 'isCollection' to resolve strangers' collections.
  React.useEffect(() => {
    if (collectionId && !resolvedCollection) {
      doFetchItemsInCollection({ collectionId });
    }
  }, [isCollection, resolvedCollection, collectionId, doFetchItemsInCollection]);

  useEffect(() => {
    if (canonicalUrl) {
      const urlPath = pathname + hash;
      const fullParams =
        urlPath.indexOf('?') > 0 ? urlPath.substring(urlPath.indexOf('?')) : search.length > 0 ? search : '';
      const canonicalUrlPath = '/' + canonicalUrl.replace(/^lbry:\/\//, '').replace(/#/g, ':') + fullParams;

      // replaceState will fail if on a different domain (like webcache.googleusercontent.com)
      const hostname = isDev ? 'localhost' : DOMAIN;

      if (canonicalUrlPath !== pathname && hostname === window.location.hostname && fullParams !== search) {
        const urlParams = new URLSearchParams(search);
        let replaceUrl = canonicalUrlPath;
        if (urlParams.get(COLLECTIONS_CONSTS.COLLECTION_ID)) {
          const listId = urlParams.get(COLLECTIONS_CONSTS.COLLECTION_ID) || '';
          urlParams.set(COLLECTIONS_CONSTS.COLLECTION_ID, listId);
          replaceUrl += `?${urlParams.toString()}`;
        }
        history.replaceState(history.state, '', replaceUrl);
      }

      const windowHref = window.location.href;
      const noUrlParams = search.length === 0;
      if (windowHref.includes('?') && noUrlParams) {
        history.replaceState(history.state, '', windowHref.substring(0, windowHref.length - 1));
      }
    }

    if (
      (doResolveUri && !isResolvingUri && uri && haventFetchedYet) ||
      (claimExists && !claimIsPending && (!canonicalUrl || isMine === undefined))
    ) {
      doResolveUri(
        uri,
        false,
        true,
        isMine === undefined ? { include_is_my_output: true, include_purchase_receipt: true } : {}
      );
    }
  }, [doResolveUri, isResolvingUri, canonicalUrl, uri, claimExists, haventFetchedYet, isMine, claimIsPending, search]);

  // Regular claims will call the file/view event when a user actually watches the claim
  // This can be removed when we get rid of the livestream iframe
  const [viewTracked, setViewTracked] = useState(false);
  useEffect(() => {
    if (showLiveStream && !viewTracked) {
      doAnalyticsView(uri);
      setViewTracked(true);
    }
  }, [showLiveStream, viewTracked]);

  // Don't navigate directly to repost urls
  // Always redirect to the actual content
  if (claim && claim.repost_url === uri) {
    const newUrl = formatLbryUrlForWeb(canonicalUrl);
    return <Redirect to={newUrl} />;
  }

  let urlForCollectionZero;
  if (claim && isCollection && collectionUrls && collectionUrls.length) {
    urlForCollectionZero = collectionUrls && collectionUrls[0];
    const claimId = claim.claim_id;
    urlParams.set(COLLECTIONS_CONSTS.COLLECTION_ID, claimId);
    const newUrl = formatLbryUrlForWeb(`${urlForCollectionZero}?${urlParams.toString()}`);
    return <Redirect to={newUrl} />;
  }

  if (!claim || !claim.name) {
    return (
      <Page>
        {(haventFetchedYet ||
          isResolvingUri ||
          isResolvingCollection || // added for collection
          (isCollection && !urlForCollectionZero)) && ( // added for collection - make sure we accept urls = []
          <div className="main--empty">
            <Spinner delayed />
          </div>
        )}

        {!isResolvingUri && !isSubscribed && (
          <div className="main--empty">
            <Yrbl
              title={isChannel ? __('Channel Not Found') : __('No Content Found')}
              subtitle={
                isChannel ? (
                  __(`Probably because you didn't make it.`)
                ) : (
                  <div className="section__actions">
                    <Button
                      button="primary"
                      label={__('Publish Something')}
                      onClick={() => doBeginPublish(contentName)}
                    />
                    <Button
                      button="secondary"
                      onClick={() => push(`/$/${PAGES.REPOST_NEW}${contentName ? `?to=${contentName}` : ''}`)}
                      label={__('Repost Something')}
                    />
                  </div>
                )
              }
            />
          </div>
        )}

        {!isResolvingUri && isSubscribed && claim === null && (
          <React.Suspense fallback={null}>
            <AbandonedChannelPreview uri={uri} type="large" />
          </React.Suspense>
        )}
      </Page>
    );
  }

  if (claim.name.length && claim.name[0] === '@') {
    return <ChannelPage uri={uri} location={location} />;
  }

  if (isClaimBlackListed && !claimIsMine) {
    return (
      <Page className="custom-wrapper">
        <Card
          title={uri}
          subtitle={__(
            'In response to a complaint we received under the US Digital Millennium Copyright Act, we have blocked access to this content from our applications.'
          )}
          actions={
            <div className="section__actions">
              <Button button="link" href="https://odysee.com/@OdyseeHelp:b/copyright:f" label={__('Read More')} />
            </div>
          }
        />
      </Page>
    );
  }

  if (showLiveStream) {
    return (
      <React.Suspense fallback={null}>
        <LivestreamPage uri={uri} claim={claim} />
      </React.Suspense>
    );
  }

  return (
    <React.Suspense fallback={null}>
      <FilePage uri={uri} collectionId={collectionId} linkedCommentId={linkedCommentId} />
    </React.Suspense>
  );
}
