// @flow
import * as PAGES from 'constants/pages';
import React, { useEffect } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import Spinner from 'component/spinner';
import ChannelPage from 'page/channel';
import Page from 'component/page';
import Button from 'component/button';
import Card from 'component/common/card';
import { formatLbryUrlForWeb } from 'util/url';
import { parseURI } from 'util/lbryURI';
import * as COLLECTIONS_CONSTS from 'constants/collections';

import AbandonedChannelPreview from 'component/abandonedChannelPreview';
import FilePage from 'page/file';
import Yrbl from 'component/yrbl';

type Props = {
  isResolvingUri: boolean,
  resolveUri: (string) => void,
  isSubscribed: boolean,
  uri: string,
  claim: StreamClaim,
  location: UrlLocation,
  title: string,
  claimIsMine: boolean,
  claimIsPending: boolean,
  beginPublish: (?string) => void,
  collectionId: string,
  collection: Collection,
  collectionUrls: Array<string>,
  isResolvingCollection: boolean,
  fetchCollectionItems: (string) => void,
  isBlacklisted: boolean,
  isBlacklistedDueToDMCA: boolean,
  errorCensor: ?ClaimErrorCensor,
};

function ShowPage(props: Props) {
  const {
    isResolvingUri,
    resolveUri,
    uri,
    claim,
    location,
    claimIsMine,
    isSubscribed,
    claimIsPending,
    beginPublish,
    fetchCollectionItems,
    collectionId,
    collection,
    collectionUrls,
    isResolvingCollection,
    isBlacklisted,
    isBlacklistedDueToDMCA,
    errorCensor,
  } = props;

  const { search } = location;

  const canonicalUrl = claim && claim.canonical_url;
  const claimExists = claim !== null && claim !== undefined;
  const haventFetchedYet = claim === undefined;
  const isMine = claim && claim.is_my_output;
  const { contentName, isChannel } = parseURI(uri); // deprecated contentName - use streamName and channelName
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
    if (
      (resolveUri && !isResolvingUri && uri && haventFetchedYet) ||
      (claimExists && !claimIsPending && (!canonicalUrl || isMine === undefined))
    ) {
      resolveUri(uri);
    }
  }, [resolveUri, isResolvingUri, canonicalUrl, uri, claimExists, haventFetchedYet, isMine, claimIsPending, search]);

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
  if ((!claim || (claim && !claim.name)) && !isBlacklisted) {
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
        {!isResolvingUri && isSubscribed && claim === null && <AbandonedChannelPreview uri={uri} type={'large'} />}
      </Page>
    );
  } else if (claim && claim.name.length && claim.name[0] === '@') {
    innerContent = <ChannelPage uri={uri} location={location} />;
  } else if (isBlacklisted && !claimIsMine) {
    innerContent = isBlacklistedDueToDMCA ? (
      <Page>
        <Card
          title={uri}
          subtitle={__(
            'Your hub has blocked access to this content do to a complaint received under the US Digital Millennium Copyright Act.'
          )}
          actions={
            <div className="section__actions">
              <Button button="link" href="https://lbry.com/faq/dmca" label={__('Read More')} />
            </div>
          }
        />
      </Page>
    ) : (
      <Page>
        <Card
          title={__('Content Blocked')}
          subtitle={
            <>
              {errorCensor &&
                __(`Your hub has blocked %content% because it subscribes to the following blocking channel:`, {
                  content: uri,
                })}{' '}
              <Button
                button="link"
                navigate={errorCensor && errorCensor.canonical_url}
                label={errorCensor && errorCensor.name}
              />
              {errorCensor && <div className={'error__text'}>{`\nMessage:\n${errorCensor.text}\n`}</div>}
            </>
          }
        />
      </Page>
    );
  } else if (claim) {
    innerContent = <FilePage uri={uri} location={location} />;
  }

  return <React.Fragment>{innerContent}</React.Fragment>;
}

export default ShowPage;
