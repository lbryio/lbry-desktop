// @flow
import { DOMAIN } from 'config';
import * as PAGES from 'constants/pages';
import React, { useEffect } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import Spinner from 'component/spinner';
import ChannelPage from 'page/channel';
import FilePage from 'page/file';
import LivestreamPage from 'page/livestream';
import Page from 'component/page';
import Button from 'component/button';
import Card from 'component/common/card';
import AbandonedChannelPreview from 'component/abandonedChannelPreview';
import Yrbl from 'component/yrbl';
import { formatLbryUrlForWeb } from 'util/url';
import { parseURI } from 'lbry-redux';

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
  claimIsMine: Boolean,
  beginPublish: (string) => void,
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
  } = props;

  const signingChannel = claim && claim.signing_channel;
  const canonicalUrl = claim && claim.canonical_url;
  const claimExists = claim !== null && claim !== undefined;
  const haventFetchedYet = claim === undefined;
  const isMine = claim && claim.is_my_output;
  const { contentName, isChannel } = parseURI(uri);
  const { push } = useHistory();

  useEffect(() => {
    // @if TARGET='web'
    if (canonicalUrl) {
      const canonicalUrlPath = '/' + canonicalUrl.replace(/^lbry:\/\//, '').replace(/#/g, ':');
      // Only redirect if we are in lbry.tv land
      // replaceState will fail if on a different domain (like webcache.googleusercontent.com)
      if (canonicalUrlPath !== window.location.pathname && DOMAIN === window.location.hostname) {
        history.replaceState(history.state, '', canonicalUrlPath);
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

  let innerContent = '';
  if (!claim || (claim && !claim.name)) {
    innerContent = (
      <Page>
        {(claim === undefined || isResolvingUri) && (
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
        {!isResolvingUri && isSubscribed && claim === null && <AbandonedChannelPreview uri={uri} type={'large'} />}
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

  return innerContent;
}

export default ShowPage;
