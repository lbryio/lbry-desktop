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
  resolveUri: (string, boolean, boolean, any) => void,
  isSubscribed: boolean,
  uri: string,
  claim: StreamClaim,
  location: UrlLocation,
  blackListedOutpointMap: { [string]: number },
  title: string,
  claimIsMine: boolean,
  claimIsPending: boolean,
  isLivestream: boolean,
  beginPublish: (?string) => void,
  collectionId: string,
  collection: Collection,
  collectionUrls: Array<string>,
  isResolvingCollection: boolean,
  fetchCollectionItems: (string) => void,
  doAnalyticsView: (string) => void,
};

function ShowPage(props: Props) {
  const {
    isResolvingUri,
    resolveUri,
    uri,
    claim,
    blackListedOutpointMap,
    location,
    claimIsMine,
    isSubscribed,
    claimIsPending,
    isLivestream,
    beginPublish,
    fetchCollectionItems,
    collectionId,
    collection,
    collectionUrls,
    isResolvingCollection,
    doAnalyticsView,
  } = props;

  const { search, pathname } = location;

  const signingChannel = claim && claim.signing_channel;
  const canonicalUrl = claim && claim.canonical_url;
  const claimExists = claim !== null && claim !== undefined;
  const haventFetchedYet = claim === undefined;
  const isMine = claim && claim.is_my_output;
  const { contentName, isChannel } = parseURI(uri); // deprecated contentName - use streamName and channelName
  const { push } = useHistory();
  const isCollection = claim && claim.value_type === 'collection';
  const resolvedCollection = collection && collection.id; // not null

  const showLiveStream = isLivestream && ENABLE_NO_SOURCE_CLAIMS;

  // changed this from 'isCollection' to resolve strangers' collections.
  React.useEffect(() => {
    if (collectionId && !resolvedCollection) {
      fetchCollectionItems(collectionId);
    }
  }, [isCollection, resolvedCollection, collectionId, fetchCollectionItems]);

  useEffect(() => {
    // @if TARGET='web'
    if (canonicalUrl) {
      const canonicalUrlPath = '/' + canonicalUrl.replace(/^lbry:\/\//, '').replace(/#/g, ':');
      // Only redirect if we are in lbry.tv land
      // replaceState will fail if on a different domain (like webcache.googleusercontent.com)
      const hostname = isDev ? 'localhost' : DOMAIN;

      if (canonicalUrlPath !== pathname && hostname === window.location.hostname) {
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
    // @endif

    if (
      (resolveUri && !isResolvingUri && uri && haventFetchedYet) ||
      (claimExists && !claimIsPending && (!canonicalUrl || isMine === undefined))
    ) {
      resolveUri(
        uri,
        false,
        true,
        isMine === undefined ? { include_is_my_output: true, include_purchase_receipt: true } : {}
      );
    }
  }, [resolveUri, isResolvingUri, canonicalUrl, uri, claimExists, haventFetchedYet, isMine, claimIsPending, search]);

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
  // Also need to add repost_url to the Claim type for flow
  // $FlowFixMe
  if (claim && claim.repost_url === uri) {
    const newUrl = formatLbryUrlForWeb(claim.canonical_url);
    return <Redirect to={newUrl} />;
  }
  let urlForCollectionZero;
  if (claim && claim.value_type === 'collection' && collectionUrls && collectionUrls.length) {
    urlForCollectionZero = collectionUrls && collectionUrls[0];
    const claimId = claim.claim_id;
    const urlParams = new URLSearchParams(search);
    urlParams.set(COLLECTIONS_CONSTS.COLLECTION_ID, claimId);
    const newUrl = formatLbryUrlForWeb(`${urlForCollectionZero}?${urlParams.toString()}`);
    return <Redirect to={newUrl} />;
  }

  let innerContent = '';
  if (!claim || (claim && !claim.name)) {
    innerContent = (
      <Page>
        {(claim === undefined ||
          isResolvingUri ||
          isResolvingCollection || // added for collection
          (claim && claim.value_type === 'collection' && !urlForCollectionZero)) && ( // added for collection - make sure we accept urls = []
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
                      onClick={() => beginPublish(contentName)}
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
            <AbandonedChannelPreview uri={uri} type={'large'} />
          </React.Suspense>
        )}
      </Page>
    );
  } else if (claim.name.length && claim.name[0] === '@') {
    innerContent = <ChannelPage uri={uri} location={location} />;
  } else if (claim) {
    const isClaimBlackListed =
      blackListedOutpointMap &&
      Boolean(
        (signingChannel && blackListedOutpointMap[`${signingChannel.txid}:${signingChannel.nout}`]) ||
          blackListedOutpointMap[`${claim.txid}:${claim.nout}`]
      );

    if (isClaimBlackListed && !claimIsMine) {
      innerContent = (
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
    } else if (showLiveStream) {
      innerContent = <LivestreamPage uri={uri} claim={claim} />;
    } else {
      innerContent = <FilePage uri={uri} location={location} />;
    }
  }

  return <React.Suspense fallback={null}>{innerContent}</React.Suspense>;
}

export default ShowPage;
