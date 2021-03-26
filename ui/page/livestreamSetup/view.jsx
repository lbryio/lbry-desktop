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

type Props = {
  channels: Array<ChannelClaim>,
  fetchingChannels: boolean,
  activeChannelClaim: ?ChannelClaim,
  pendingClaims: Array<Claim>,
};

export default function LivestreamSetupPage(props: Props) {
  const { channels, fetchingChannels, activeChannelClaim, pendingClaims } = props;

  const [sigData, setSigData] = React.useState({ signature: undefined, signing_ts: undefined });
  const [showHelpTest, setShowHelpTest] = usePersistedState('livestream-help-seen', true);
  const [spin, setSpin] = React.useState(true);

  const hasChannels = channels && channels.length > 0;
  const activeChannelClaimStr = JSON.stringify(activeChannelClaim);
  const streamKey = createStreamKey();

  const helpText = (
    <div className="section__subtitle">
      <p>
        {__(
          `The Go Live process begins by first submitting your Livestream details and waiting for approval confirmation.`
        )}{' '}
        {__(
          `The livestream will not be visible on your channel until you are live, but you can share the URL in advance.`
        )}{' '}
        {__(
          `Once the your livestream is confirmed, configure your streaming software (OBS, Restream, etc) at the server URL above along with the stream key.`
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
      <p>{__(`If not using OBS, make sure the bitrate is below 5Mbps or the stream will not work.`)}</p>
      <p>
        {__(
          `You'll need to record your own stream through your software if you plan to share it afterward. You can also delete it if you prefer not to upload the copy. In the near future, we'll support a more streamlined process that will let you upload the replay.`
        )}
      </p>
      <p>
        {__(`After your livestream:
      Click the Upload Stream button. This will allow you to edit any final details before uploading and select the saved mp4 file you recorded.`)}
      </p>
      <p>{__(`Click save once you are done.`)}</p>
    </div>
  );
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
        setSpin(false);
      })
      .catch(() => {
        setLivestreamClaims([]);
        setSpin(false);
      });
  }, [activeChannelClaimStr, pendingLength, setSpin]);

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
