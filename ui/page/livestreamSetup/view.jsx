// @flow
import * as PAGES from 'constants/pages';
import * as PUBLISH_MODES from 'constants/publish_types';
import React from 'react';
import Page from 'component/page';
import Spinner from 'component/spinner';
import Button from 'component/button';
import ChannelSelector from 'component/channelSelector';
import Yrbl from 'component/yrbl';
import { Lbry } from 'lbry-redux';
import { toHex } from 'util/hex';
import { FormField } from 'component/common/form';
import CopyableText from 'component/copyableText';
import Card from 'component/common/card';
import ClaimList from 'component/claimList';

type Props = {
  channels: Array<ChannelClaim>,
  fetchingChannels: boolean,
  activeChannelClaim: ?ChannelClaim,
  pendingClaims: Array<Claim>,
};

export default function LivestreamSetupPage(props: Props) {
  const { channels, fetchingChannels, activeChannelClaim, pendingClaims } = props;

  const [sigData, setSigData] = React.useState({ signature: undefined, signing_ts: undefined });
  const [componentReady, setComponentReady] = React.useState(false);

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
            setSigData(data);
            setComponentReady(true);
          })
          .catch((error) => {
            setSigData({ signature: null, signing_ts: null });
          });
      }
    }
  }, [activeChannelClaimStr, setSigData, setComponentReady]);

  function createStreamKey() {
    if (!activeChannelClaim || !sigData.signature || !sigData.signing_ts) return null;
    return `${activeChannelClaim.claim_id}?d=${toHex(activeChannelClaim.name)}&s=${sigData.signature}&t=${
      sigData.signing_ts
    }`;
  }

  const [livestreamClaims, setLivestreamClaims] = React.useState([]);
  const pendingLiveStreamClaims =
    // $FlowFixMe
    pendingClaims ? pendingClaims.filter((claim) => !(claim && claim.value && claim.value.source)) : [];
  const pendingLength = pendingLiveStreamClaims.length;
  const totalLivestreamClaims = pendingLiveStreamClaims.concat(livestreamClaims);

  React.useEffect(() => {
    if (!activeChannelClaimStr) return;

    const channelClaim = JSON.parse(activeChannelClaimStr);

    Lbry.claim_search({
      channel_ids: [channelClaim.claim_id],
      has_no_source: true,
      claim_type: ['stream'],
    })
      .then((res) => {
        if (res && res.items && res.items.length > 0) {
          setLivestreamClaims(res.items.reverse());
        } else {
          setLivestreamClaims([]);
        }
      })
      .catch(() => {
        setLivestreamClaims([]);
      });
  }, [activeChannelClaimStr, pendingLength]);

  return (
    <Page>
      {fetchingChannels && !componentReady && (
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

      <div className="card-stack">
        {!fetchingChannels && activeChannelClaim && (
          <>
            <ChannelSelector hideAnon />

            {streamKey && totalLivestreamClaims.length > 0 && (
              <Card
                title={__('Your stream key')}
                actions={
                  <>
                    <CopyableText
                      primaryButton
                      name="stream-server"
                      label={__('Stream server')}
                      copyable="rtmp://stream.odysee.com/live"
                      snackMessage={__('Copied')}
                    />
                    <CopyableText
                      primaryButton
                      name="livestream-key"
                      label={__('Stream key')}
                      copyable={streamKey}
                      snackMessage={__('Copied')}
                    />
                  </>
                }
              />
            )}

            {componentReady && totalLivestreamClaims.length > 0 ? (
              <ClaimList
                header={__('Your livestream uploads')}
                uris={totalLivestreamClaims.map((claim) => claim.permanent_url)}
              />
            ) : (
              <Yrbl
                className="livestream__publish-intro"
                title={__('No livestream publishes found')}
                subtitle={__('You need to upload your livestream details before you can go live.')}
                actions={
                  <div className="section__actions">
                    <Button
                      button="primary"
                      navigate={`/$/${PAGES.UPLOAD}?type=${PUBLISH_MODES.LIVESTREAM.toLowerCase()}`}
                      label={__('Create A Livestream')}
                    />
                  </div>
                }
              />
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
          </>
        )}
      </div>
    </Page>
  );
}
