// @flow
import { DOMAIN } from 'config';
import * as PAGES from 'constants/pages';
import React, { useEffect } from 'react';
import { lazyImport } from 'util/lazyImport';
import { Redirect, useHistory } from 'react-router-dom';
import Spinner from 'component/spinner';
import ChannelPage from 'page/channel';
import Page from 'component/page';
import Button from 'component/button';
import Card from 'component/common/card';
import { formatLbryUrlForWeb } from 'util/url';
import { parseURI, COLLECTIONS_CONSTS } from 'lbry-redux';

const AbandonedChannelPreview = lazyImport(() => import('component/abandonedChannelPreview' /* webpackChunkName: "abandonedChannelPreview" */));
const FilePage = lazyImport(() => import('page/file' /* webpackChunkName: "filePage" */));
const LivestreamPage = lazyImport(() => import('page/livestream' /* webpackChunkName: "livestream" */));
const Yrbl = lazyImport(() => import('component/yrbl' /* webpackChunkName: "yrbl" */));

type Props = {
  isResolvingUri: boolean,
  resolveUri: (string) => void,
  isSubscribed: boolean,
  uri: string,
  claim: StreamClaim,
  location: UrlLocation,
  blackListedOutpoints: Array<{
    txid: string,
    nout: number,
  }>,
  title: string,
  claimIsMine: boolean,
  claimIsPending: boolean,
  isLivestream: boolean,
  beginPublish: (string) => void,
  collectionId: string,
  collection: Collection,
  collectionUrls: Array<string>,
  isResolvingCollection: boolean,
  fetchCollectionItems: (string) => void,
};

function ShowPage(props: Props) {
  const {
    isResolvingUri,
    resolveUri,
    uri,
    claim,
    blackListedOutpoints,
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
  } = props;

  const { search } = location;

  const signingChannel = claim && claim.signing_channel;
  const canonicalUrl = claim && claim.canonical_url;
  const claimExists = claim !== null && claim !== undefined;
  const haventFetchedYet = claim === undefined;
  const isMine = claim && claim.is_my_output;
  const { contentName, isChannel } = parseURI(uri);
  const { push } = useHistory();
  const isCollection = claim && claim.value_type === 'collection';
  const resolvedCollection = collection && collection.id; // not null

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
      if (canonicalUrlPath !== window.location.pathname && DOMAIN === window.location.hostname) {
        const urlParams = new URLSearchParams(search);
        if (urlParams.get(COLLECTIONS_CONSTS.COLLECTION_ID)) {
          const listId = urlParams.get(COLLECTIONS_CONSTS.COLLECTION_ID) || '';
          urlParams.set(COLLECTIONS_CONSTS.COLLECTION_ID, listId);
        }
        history.replaceState(history.state, '', `${canonicalUrlPath}?${urlParams.toString()}`);
      }
    }
    // @endif

    if (
      (resolveUri && !isResolvingUri && uri && haventFetchedYet) ||
      (claimExists && !claimIsPending && (!canonicalUrl || isMine === undefined))
    ) {
      resolveUri(uri);
    }
  }, [resolveUri, isResolvingUri, canonicalUrl, uri, claimExists, haventFetchedYet, history, isMine, claimIsPending]);

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
                      onClick={() => push(`/$/${PAGES.REPOST_NEW}?to=${contentName}`)}
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
    let isClaimBlackListed = false;

    isClaimBlackListed =
      blackListedOutpoints &&
      blackListedOutpoints.some(
        (outpoint) =>
          (signingChannel && outpoint.txid === signingChannel.txid && outpoint.nout === signingChannel.nout) ||
          (outpoint.txid === claim.txid && outpoint.nout === claim.nout)
      );

    if (isClaimBlackListed && !claimIsMine) {
      innerContent = (
        <Page>
          <Card
            title={uri}
            subtitle={__(
              'In response to a complaint we received under the US Digital Millennium Copyright Act, we have blocked access to this content from our applications.'
            )}
            actions={
              <div className="section__actions">
                <Button button="link" href="https://lbry.com/faq/dmca" label={__('Read More')} />
              </div>
            }
          />
        </Page>
      );
    } else if (isLivestream) {
      innerContent = <LivestreamPage uri={uri} />;
    } else {
      innerContent = <FilePage uri={uri} location={location} />;
    }
  }

  return <React.Suspense fallback={null}>{innerContent}</React.Suspense>;
}

export default ShowPage;
