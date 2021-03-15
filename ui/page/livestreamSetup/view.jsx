// @flow
import * as PAGES from 'constants/pages';
import React from 'react';
import Page from 'component/page';
import Spinner from 'component/spinner';
import Button from 'component/button';
import ChannelSelector from 'component/channelSelector';
import Yrbl from 'component/yrbl';
import { Lbry } from 'lbry-redux';
import { toHex } from 'util/hex';
import ClaimPreview from 'component/claimPreview';
import { FormField } from 'component/common/form';
import * as PUBLISH_MODES from 'constants/publish_types';

type Props = {
  channels: Array<ChannelClaim>,
  fetchingChannels: boolean,
  activeChannelClaim: ?ChannelClaim,
};

export default function LivestreamSetupPage(props: Props) {
  const { channels, fetchingChannels, activeChannelClaim } = props;

  const [sigData, setSigData] = React.useState({ signature: undefined, signing_ts: undefined });

  const hasChannels = channels && channels.length > 0;
  const activeChannelClaimStr = JSON.stringify(activeChannelClaim);
  const streamKey = createStreamKey();

  React.useEffect(() => {
    if (activeChannelClaimStr) {
      const channelClaim = JSON.parse(activeChannelClaimStr);

      // ensure we have a channel
      if (channelClaim.claim_id) {
        Lbry.channel_sign({
          channel_id: channelClaim.claim_id,
          hexdata: toHex(channelClaim.name),
        })
          .then((data) => {
            console.log(data);
            setSigData(data);
          })
          .catch((error) => {
            setSigData({ signature: null, signing_ts: null });
            console.error(error);
          });
      }
    }
  }, [activeChannelClaimStr, setSigData]);

  function createStreamKey() {
    if (!activeChannelClaim || !sigData.signature || !sigData.signing_ts) return null;
    return `${activeChannelClaim.claim_id}?d=${toHex(activeChannelClaim.name)}&s=${sigData.signature}&t=${
      sigData.signing_ts
    }`;
  }

  /******/

  const LIVE_STREAM_TAG = 'odysee-livestream';

  const [isFetching, setIsFetching] = React.useState(true);
  const [isLive, setIsLive] = React.useState(false);
  const [livestreamClaim, setLivestreamClaim] = React.useState(false);
  const [livestreamClaims, setLivestreamClaims] = React.useState([]);

  React.useEffect(() => {
    if (!activeChannelClaimStr) return;

    const channelClaim = JSON.parse(activeChannelClaimStr);

    Lbry.claim_search({
      channel_ids: [channelClaim.claim_id],
      any_tags: [LIVE_STREAM_TAG],
      claim_type: ['stream'],
    })
      .then((res) => {
        if (res && res.items && res.items.length > 0) {
          const claim = res.items[res.items.length - 1];
          setLivestreamClaim(claim);
          setLivestreamClaims(res.items.reverse());
        } else {
          setIsFetching(false);
        }
      })
      .catch(() => {
        setIsFetching(false);
      });
  }, [activeChannelClaimStr]);

  return (
    <Page>
      {fetchingChannels && (
        <div className="main--empty">
          <Spinner delayed />
        </div>
      )}

      {!fetchingChannels && !hasChannels && (
        <Yrbl
          type="happy"
          title={__("You haven't created a channel yet, let's fix that!")}
          actions={
            <div className="section__actions">
              <Button button="primary" navigate={`/$/${PAGES.CHANNEL_NEW}`} label={__('Create A Channel')} />
            </div>
          }
        />
      )}

      {!fetchingChannels && activeChannelClaim && (
        <React.Fragment>
          {/* Channel Selector */}
          <ChannelSelector hideAnon />

          {/* Display StreamKey */}
          {streamKey ? (
            <div>
              {/* Stream Server Address */}
              <FormField
                name={'livestreamServer'}
                label={'Stream Server'}
                type={'text'}
                defaultValue={'rtmp://stream.odysee.com/live'}
                readOnly
              />

              {/* Stream Key */}
              <FormField name={'livestreamKey'} label={'Stream Key'} type={'text'} defaultValue={streamKey} readOnly />
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: 'var(--spacing-l)' }}>{JSON.stringify(activeChannelClaim)}</div>
              {sigData && <div>{JSON.stringify(sigData)}</div>}
            </div>
          )}

          {/* Stream Claim(s) */}
          {livestreamClaim && livestreamClaims ? (
            <div style={{ marginTop: 'var(--spacing-l)' }}>
              <h3>Your LiveStream Claims</h3>

              {livestreamClaims.map((claim) => (
                <ClaimPreview key={claim.uri} uri={claim.permanent_url} />
              ))}

              {/*<h3>Your LiveStream Claims</h3>
              <ClaimPreview
                uri={livestreamClaim.permanent_url}
              />*/}
            </div>
          ) : (
            <div style={{ marginTop: 'var(--spacing-l)' }}>
              <div>You must first publish a livestream claim before your stream will be visible!</div>

              {/* Relies on https://github.com/lbryio/lbry-desktop/pull/5669 */}
              <Button
                button="primary"
                navigate={`/$/${PAGES.UPLOAD}?type=${PUBLISH_MODES.LIVESTREAM.toLowerCase()}`}
                label={__('Create A LiveStream')}
              />
            </div>
          )}

          {/* Debug Stuff */}
          {streamKey && false && (
            <div style={{ marginTop: 'var(--spacing-l)' }}>
              <h3>Debug Info</h3>

              {/* Channel ID */}
              <FormField
                name={'channelId'}
                label={'Channel ID'}
                type={'text'}
                defaultValue={activeChannelClaim.claim_id}
                readOnly
              />

              {/* Signature */}
              <FormField
                name={'signature'}
                label={'Signature'}
                type={'text'}
                defaultValue={sigData.signature}
                readOnly
              />

              {/* Signature TS */}
              <FormField
                name={'signaturets'}
                label={'Signature Timestamp'}
                type={'text'}
                defaultValue={sigData.signing_ts}
                readOnly
              />

              {/* Hex Data */}
              <FormField
                name={'datahex'}
                label={'Hex Data'}
                type={'text'}
                defaultValue={toHex(activeChannelClaim.name)}
                readOnly
              />

              {/* Channel Public Key */}
              <FormField
                name={'channelpublickey'}
                label={'Public Key'}
                type={'text'}
                defaultValue={activeChannelClaim.value.public_key}
                readOnly
              />
            </div>
          )}
        </React.Fragment>
      )}
    </Page>
  );
}
