// @flow
import * as PAGES from 'constants/pages';
import * as ICONS from 'constants/icons';
import * as PUBLISH_MODES from 'constants/publish_types';
import I18nMessage from 'component/i18nMessage';
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
import { LIVESTREAM_RTMP_URL } from 'constants/livestream';

type Props = {
  channels: Array<ChannelClaim>,
  fetchingChannels: boolean,
  activeChannelClaim: ?ChannelClaim,
  pendingClaims: Array<Claim>,
  doNewLivestream: (string) => void,
  fetchNoSourceClaims: (string) => void,
  myLivestreamClaims: Array<Claim>,
  fetchingLivestreams: boolean,
  channelId: ?string,
  channelName: ?string,
};

export default function LivestreamSetupPage(props: Props) {
  const LIVESTREAM_CLAIM_POLL_IN_MS = 60000;
  const {
    channels,
    fetchingChannels,
    activeChannelClaim,
    pendingClaims,
    doNewLivestream,
    fetchNoSourceClaims,
    myLivestreamClaims,
    fetchingLivestreams,
    channelId,
    channelName,
  } = props;

  const [sigData, setSigData] = React.useState({ signature: undefined, signing_ts: undefined });
  const [showHelp, setShowHelp] = usePersistedState('livestream-help-seen', true);

  const hasChannels = channels && channels.length > 0;
  const hasLivestreamClaims = Boolean(myLivestreamClaims.length || pendingClaims.length);

  function createStreamKey() {
    if (!channelId || !channelName || !sigData.signature || !sigData.signing_ts) return null;
    return `${channelId}?d=${toHex(channelName)}&s=${sigData.signature}&t=${sigData.signing_ts}`;
  }

  const streamKey = createStreamKey();

  const pendingLength = pendingClaims.length;
  const totalLivestreamClaims = pendingClaims.concat(myLivestreamClaims);
  const helpText = (
    <div className="section__subtitle">
      <p>
        {__(
          `Create a Livestream by first submitting your livestream details and waiting for approval confirmation. This can be done well in advance and will take a few minutes.`
        )}{' '}
        {__(
          `The livestream will not be visible on your channel page until you are live, but you can share the URL in advance.`
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
        {__(`If using other streaming software, make sure the bitrate is below 4500 kbps or the stream will not work.`)}
      </p>
      <p>
        {__(
          `After your stream:\nClick the Update button on the content page. This will allow you to select a replay or upload your own edited MP4. Replays are limited to 4 hours and may take a few minutes to show (use the Check For Replays button).`
        )}
      </p>
      <p>{__(`Click Save, then confirm, and you are done!`)}</p>
      <p>
        {__(
          `Note: If you don't plan on publishing your replay, you'll want to delete your livestream and then start with a fresh one next time.`
        )}
      </p>
    </div>
  );

  React.useEffect(() => {
    // ensure we have a channel
    if (channelId && channelName) {
      Lbry.channel_sign({
        channel_id: channelId,
        hexdata: toHex(channelName),
      })
        .then((data) => {
          setSigData(data);
        })
        .catch((error) => {
          setSigData({ signature: null, signing_ts: null });
        });
    }
  }, [channelName, channelId, setSigData]);

  React.useEffect(() => {
    let checkClaimsInterval;
    if (!channelId) return;

    if (!checkClaimsInterval) {
      fetchNoSourceClaims(channelId);
      checkClaimsInterval = setInterval(() => fetchNoSourceClaims(channelId), LIVESTREAM_CLAIM_POLL_IN_MS);
    }
    return () => {
      if (checkClaimsInterval) {
        clearInterval(checkClaimsInterval);
      }
    };
  }, [channelId, pendingLength, fetchNoSourceClaims]);

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
          <Button button="link" onClick={() => setShowHelp(!showHelp)} label={__('How does this work?')} />
        </div>
      )}

      {fetchingLivestreams && !fetchingChannels && !hasLivestreamClaims && (
        <div className="main--empty">
          <Spinner delayed />
        </div>
      )}
      <div className="card-stack">
        {!fetchingChannels && channelId && (
          <>
            {showHelp && (
              <Card
                titleActions={<Button button="close" icon={ICONS.REMOVE} onClick={() => setShowHelp(false)} />}
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
                      copyable={LIVESTREAM_RTMP_URL}
                      snackMessage={__('Copied stream server URL.')}
                    />
                    <CopyableText
                      primaryButton
                      enableInputMask
                      name="livestream-key"
                      label={__('Stream key')}
                      copyable={streamKey}
                      snackMessage={__('Copied stream key.')}
                    />
                  </>
                }
              />
            )}

            {totalLivestreamClaims.length > 0 ? (
              <>
                {Boolean(pendingClaims.length) && (
                  <div className="section">
                    <ClaimList
                      header={__('Your pending livestream uploads')}
                      uris={pendingClaims.map((claim) => claim.permanent_url)}
                    />
                  </div>
                )}
                {Boolean(myLivestreamClaims.length) && (
                  <div className="section">
                    <ClaimList
                      header={__('Your livestream uploads')}
                      empty={
                        <I18nMessage
                          tokens={{
                            check_again: (
                              <Button
                                button="link"
                                onClick={() => fetchNoSourceClaims(channelId)}
                                label={__('Check again')}
                              />
                            ),
                          }}
                        >
                          Nothing here yet. %check_again%
                        </I18nMessage>
                      }
                      uris={myLivestreamClaims
                        .filter(
                          (claim) => !pendingClaims.some((pending) => pending.permanent_url === claim.permanent_url)
                        )
                        .map((claim) => claim.permanent_url)}
                    />
                  </div>
                )}
              </>
            ) : (
              <Yrbl
                className="livestream__publish-intro"
                title={__('No livestream publishes found')}
                subtitle={__(
                  'You need to upload your livestream details before you can go live. If you already created one in this channel, it should appear soon.'
                )}
                actions={
                  <div className="section__actions">
                    <Button
                      button="primary"
                      onClick={() =>
                        doNewLivestream(`/$/${PAGES.UPLOAD}?type=${PUBLISH_MODES.LIVESTREAM.toLowerCase()}`)
                      }
                      label={__('Create A Livestream')}
                    />
                    <Button
                      button="alt"
                      onClick={() => {
                        fetchNoSourceClaims(channelId);
                      }}
                      label={__('Check again...')}
                    />
                  </div>
                }
              />
            )}

            {/* Debug Stuff */}
            {streamKey && false && activeChannelClaim && (
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
