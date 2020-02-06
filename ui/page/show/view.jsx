// @flow
import React, { useEffect } from 'react';
import { parseURI } from 'lbry-redux';
import BusyIndicator from 'component/common/busy-indicator';
import ChannelPage from 'page/channel';
import FilePage from 'page/file';
import Page from 'component/page';
import Button from 'component/button';
import { SITE_TITLE } from 'config';
import Card from 'component/common/card';
import AbandonedChannelPreview from 'component/abandonedChannelPreview';

type Props = {
  isResolvingUri: boolean,
  resolveUri: string => void,
  isSubscribed: boolean,
  uri: string,
  claim: StreamClaim,
  location: UrlLocation,
  blackListedOutpoints: Array<{
    txid: string,
    nout: number,
  }>,
  title: string,
  claimIsMine: Boolean,
};

function ShowPage(props: Props) {
  const {
    isResolvingUri,
    resolveUri,
    uri,
    claim,
    blackListedOutpoints,
    location,
    title,
    claimIsMine,
    isSubscribed,
  } = props;
  const { channelName, streamName } = parseURI(uri);
  const signingChannel = claim && claim.signing_channel;
  const canonicalUrl = claim && claim.canonical_url;
  const claimExists = claim !== null && claim !== undefined;
  const haventFetchedYet = claim === undefined;

  useEffect(() => {
    // @if TARGET='web'
    if (canonicalUrl) {
      const canonicalUrlPath = '/' + canonicalUrl.replace(/^lbry:\/\//, '').replace(/#/g, ':');
      if (canonicalUrlPath !== window.location.pathname) {
        history.replaceState(history.state, '', canonicalUrlPath);
      }
    }
    // @endif

    if ((resolveUri && !isResolvingUri && uri && haventFetchedYet) || (claimExists && !canonicalUrl)) {
      resolveUri(uri);
    }
  }, [resolveUri, isResolvingUri, canonicalUrl, uri, claimExists, haventFetchedYet]);

  useEffect(() => {
    if (title) {
      document.title = title;
    } else if (streamName) {
      document.title = streamName;
    } else if (channelName) {
      document.title = channelName;
    } else {
      document.title = IS_WEB ? SITE_TITLE : 'LBRY';
    }

    return () => {
      document.title = IS_WEB ? SITE_TITLE : 'LBRY';
    };
  }, [title, channelName, streamName]);

  let innerContent = '';

  if (!claim || (claim && !claim.name)) {
    if (claim && !claim.name) {
      // While testing the normalization changes, Brannon found that `name` was missing sometimes
      // This shouldn't happen, so hopefully this helps track it down
      console.error('No name for associated claim: ', claim.claim_id); // eslint-disable-line no-console
    }
    innerContent = (
      <Page>
        {(claim === undefined || isResolvingUri) && <BusyIndicator message={__('Loading decentralized data...')} />}
        {!isResolvingUri && !isSubscribed && (
          <span className="empty">{__("There's nothing available at this location.")}</span>
        )}
        {!isResolvingUri && isSubscribed && claim === null && <AbandonedChannelPreview uri={uri} type={'large'} />}
      </Page>
    );
  } else if (claim.name.length && claim.name[0] === '@') {
    innerContent = <ChannelPage uri={uri} location={location} />;
  } else if (claim && blackListedOutpoints) {
    let isClaimBlackListed = false;

    isClaimBlackListed = blackListedOutpoints.some(
      outpoint =>
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
              <div className="card__actions">
                <Button button="link" href="https://lbry.com/faq/dmca" label={__('Read More')} />
              </div>
            }
          />
        </Page>
      );
    } else {
      innerContent = <FilePage uri={uri} location={location} />;
    }
  }

  return innerContent;
}

export default ShowPage;
