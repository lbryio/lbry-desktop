// @flow
import * as PAGES from 'constants/pages';
import * as ICONS from 'constants/icons';
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
import usePersistedState from 'effects/use-persisted-state';
import usePrevious from 'effects/use-previous';

type Props = {
  channels: Array<ChannelClaim>,
  fetchingChannels: boolean,
  activeChannelClaim: ?ChannelClaim,
  pendingClaims: Array<Claim>,
};

export default function LivestreamSetupPage(props: Props) {
  const LIVESTREAM_CLAIM_POLL_IN_MS = 60000;
  const { channels, fetchingChannels, activeChannelClaim, pendingClaims } = props;

  const [sigData, setSigData] = React.useState({ signature: undefined, signing_ts: undefined });
  const [showHelpTest, setShowHelpTest] = usePersistedState('livestream-help-seen', true);
  const [spin, setSpin] = React.useState(true);
  const [livestreamClaims, setLivestreamClaims] = React.useState([]);

  const hasChannels = channels && channels.length > 0;
  const activeChannelClaimStr = JSON.stringify(activeChannelClaim);

  function createStreamKey() {
    if (!activeChannelClaim || !sigData.signature || !sigData.signing_ts) return null;
    return `${activeChannelClaim.claim_id}?d=${toHex(activeChannelClaim.name)}&s=${sigData.signature}&t=${
      sigData.signing_ts
    }`;
  }

  const streamKey = createStreamKey();
  const pendingLiveStreamClaims = pendingClaims
    ? pendingClaims.filter(
        (claim) =>
          // $FlowFixMe
          claim.value_type === 'stream' && !(claim.value && claim.value.source)
      )
    : [];
  const [localPending, setLocalPending] = React.useState([]); //
  const localPendingStr = JSON.stringify(localPending);
  const pendingLivestreamClaimsStr = JSON.stringify(pendingLiveStreamClaims);
  const prevPendingLiveStreamClaimStr = usePrevious(pendingLivestreamClaimsStr);
  const liveStreamClaimsStr = JSON.stringify(livestreamClaims);
  const prevLiveStreamClaimsStr = JSON.stringify(liveStreamClaimsStr);
  const pendingLength = pendingLiveStreamClaims.length;

  // maintain a pendingClaims list by channelId that locally that things are removed from only when they show up in claim_search results.

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
          })
          .catch((error) => {
            setSigData({ signature: null, signing_ts: null });
          });
      }
    }
  }, [activeChannelClaimStr, setSigData]);

  // The following 2 effects handle the time between pending disappearing and claim_search being able to find it.
  // We'll maintain our own pending list:
  // add to it when there are new things in pending
  // remove items only when our claim_search finds it
  React.useEffect(() => {
    // add to localPending when pending changes
    const localPending = JSON.parse(localPendingStr);
    const pendingLivestreamClaims = JSON.parse(pendingLivestreamClaimsStr);
    if (
      pendingLiveStreamClaims !== prevPendingLiveStreamClaimStr ||
      (pendingLivestreamClaims.length && !localPending.length)
    ) {
      const prevPendingLivestreamClaims = prevPendingLiveStreamClaimStr
        ? JSON.parse(prevPendingLiveStreamClaimStr)
        : [];
      const pendingClaimIds = pendingLivestreamClaims.map((claim) => claim.claim_id);
      const prevPendingClaimIds = prevPendingLivestreamClaims.map((claim) => claim.claim_id);
      const newLocalPending = [];
      if (pendingClaimIds.length > prevPendingClaimIds.length) {
        pendingLivestreamClaims.forEach((pendingClaim) => {
          if (!localPending.some((lClaim) => lClaim.claim_id === pendingClaim.claim_id)) {
            newLocalPending.push(pendingClaim);
          }
        });
        setLocalPending(localPending.concat(newLocalPending));
      }
    }
  }, [pendingLivestreamClaimsStr, prevPendingLiveStreamClaimStr, localPendingStr, setLocalPending]);

  React.useEffect(() => {
    // remove from localPending when livestreamClaims found
    const localPending = JSON.parse(localPendingStr);
    if (liveStreamClaimsStr !== prevLiveStreamClaimsStr && localPending.length) {
      const livestreamClaims = JSON.parse(liveStreamClaimsStr);
      setLocalPending(
        localPending.filter((pending) => !livestreamClaims.some((claim) => claim.claim_id === pending.claim_id))
      );
    }
  }, [liveStreamClaimsStr, prevLiveStreamClaimsStr, localPendingStr, setLocalPending]);

  React.useEffect(() => {
    let checkClaimsInterval;
    if (!activeChannelClaimStr) return;
    const channelClaim = JSON.parse(activeChannelClaimStr);

    function checkLivestreamClaims() {
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
          setSpin(false);
        })
        .catch(() => {
          setLivestreamClaims([]);
          setSpin(false);
        });
    }
    if (!checkClaimsInterval) {
      checkLivestreamClaims();
      checkClaimsInterval = setInterval(checkLivestreamClaims, LIVESTREAM_CLAIM_POLL_IN_MS);
    }
    return () => {
      if (checkClaimsInterval) {
        clearInterval(checkClaimsInterval);
      }
    };
  }, [activeChannelClaimStr, pendingLength, setSpin]);
  const activeChannelId = activeChannelClaim && activeChannelClaim.claim_id;
  const localPendingForChannel = localPending.filter(
    (claim) => claim.signing_channel && claim.signing_channel.claim_id === activeChannelId
  );
  const totalLivestreamClaims = localPendingForChannel.concat(livestreamClaims);

  const helpText = (
    <div className="section__subtitle">
      <p>
        {__(`Create a Livestream by first submitting your Livestream details and waiting for approval confirmation.`)}{' '}
        {__(
          `The livestream will not be visible on your channel until you are live, but you can share the URL in advance.`
        )}{' '}
        {__(
          `Once the your livestream is confirmed, configure your streaming software (OBS, Restream, etc) and input the server URL along with the stream key in it.`
        )}
      </p>
      <p>{__(`To ensure the best streaming experience with OBS, open settings -> output`)}</p>
      <p>{__(`Select advanced mode from the dropdown at the top.`)}</p>
      <p>{__(`Ensure the following settings are selected under the streaming tab:`)}</p>
      <ul>
        <li>{__(`Bitrate: 1000 to 2500 kbps`)}</li>
        <li>{__(`Keyframes: 1`)}</li>
        <li>{__(`Profile: High`)}</li>
        <li>{__(`Tune: Zerolatency`)}</li>
      </ul>
      <p>
        {__(
          `If using other livestreaming software, make sure the bitrate is below 5000 kbps or the stream will not work.`
        )}
      </p>
      <p>
        {__(
          `Please note: You'll need to record your own stream through your software if you plan to share it afterward. You can also delete it if you prefer not to upload the copy.`
        )}
      </p>
      <p>
        {__(
          `In the near future, this manual step will be removed and you will be able to share the stream right after its finished without needing to record it yourself.`
        )}
      </p>
      <p>
        {__(`After your livestream:
      Click the Publish Replay button. This will allow you to edit details before sharing on Odysee. Be sure to select the saved mp4 file you recorded.`)}
      </p>
      <p>{__(`Click Save and you are done!`)}</p>
    </div>
  );

  return (
    <Page>
      {(fetchingChannels || spin) && (
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
      {!fetchingChannels && (
        <div className="section__actions--between">
          <ChannelSelector hideAnon />
          <Button button="link" onClick={() => setShowHelpTest(!showHelpTest)} label={__('How does this work?')} />
        </div>
      )}

      {spin && !fetchingChannels && (
        <div className="main--empty">
          <Spinner delayed />
        </div>
      )}
      <div className="card-stack">
        {!spin && !fetchingChannels && activeChannelClaim && (
          <>
            {showHelpTest && (
              <Card
                titleActions={<Button button="close" icon={ICONS.REMOVE} onClick={() => setShowHelpTest(false)} />}
                title={__('Go Live on Odysee')}
                subtitle={__(`You're invited to try out our new livestreaming service while in beta!`)}
                actions={helpText}
              />
            )}
            {streamKey && totalLivestreamClaims.length > 0 && (
              <Card
                className="section"
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

            {totalLivestreamClaims.length > 0 ? (
              <>
                {Boolean(localPendingForChannel.length) && (
                  <div className="section">
                    <ClaimList
                      header={__('Your pending livestream uploads')}
                      uris={localPendingForChannel.map((claim) => claim.permanent_url)}
                    />
                  </div>
                )}
                {Boolean(livestreamClaims.length) && (
                  <div className="section">
                    <ClaimList
                      header={__('Your livestream uploads')}
                      uris={livestreamClaims
                        .filter((c) => !pendingLiveStreamClaims.some((p) => p.permanent_url === c.permanent_url))
                        .map((claim) => claim.permanent_url)}
                    />
                  </div>
                )}
              </>
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
