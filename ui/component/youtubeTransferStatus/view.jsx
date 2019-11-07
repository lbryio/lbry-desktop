// @flow
import * as PAGES from 'constants/pages';
import * as React from 'react';
import Button from 'component/button';
import ClaimPreview from 'component/claimPreview';
import Card from 'component/common/card';
import { YOUTUBE_STATUSES } from 'lbryinc';
import { buildURI } from 'lbry-redux';
import I18nMessage from 'component/i18nMessage';

const STATUS_URL = 'https://lbry.com/youtube/status/';

type Props = {
  youtubeChannels: Array<any>,
  youtubeImportPending: boolean,
  claimChannels: () => void,
  updateUser: () => void,
  checkYoutubeTransfer: () => void,
  videosImported: ?Array<number>, // [currentAmountImported, totalAmountToImport]
  hideChannelLink: boolean,
};

export default function YoutubeTransferStatus(props: Props) {
  const {
    youtubeChannels,
    youtubeImportPending,
    claimChannels,
    videosImported,
    checkYoutubeTransfer,
    updateUser,
    hideChannelLink = false,
  } = props;
  const hasChannels = youtubeChannels && youtubeChannels.length;
  const transferEnabled = youtubeChannels.some(status => status.transferable);
  const hasPendingTransfers = youtubeChannels.some(
    status => status.transfer_state === YOUTUBE_STATUSES.PENDING_TRANSFER
  );
  const isYoutubeTransferComplete =
    hasChannels && youtubeChannels.every(channel => channel.transfer_state === YOUTUBE_STATUSES.COMPLETED_TRANSFER);

  let total;
  let complete;
  if (hasPendingTransfers && videosImported) {
    complete = videosImported[0];
    total = videosImported[1];
  }

  function getMessage(channel) {
    const { transferable, transfer_state: transferState, sync_status: syncStatus } = channel;
    if (!transferable) {
      switch (transferState) {
        case YOUTUBE_STATUSES.NOT_TRANSFERRED:
          return syncStatus[0].toUpperCase() + syncStatus.slice(1);
        case YOUTUBE_STATUSES.PENDING_TRANSFER:
          return __('Transfer in progress');
        case YOUTUBE_STATUSES.COMPLETED_TRANSFER:
          return __('Completed transfer');
      }
    } else {
      return __('Ready to transfer');
    }
  }

  React.useEffect(() => {
    // If a channel is transferable, there's nothing to check
    if (hasPendingTransfers) {
      checkYoutubeTransfer();

      let interval = setInterval(() => {
        checkYoutubeTransfer();
        updateUser();
      }, 60 * 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [hasPendingTransfers, checkYoutubeTransfer, updateUser]);

  return (
    hasChannels &&
    !isYoutubeTransferComplete && (
      <div>
        <Card
          title={youtubeChannels.length > 1 ? __('Your YouTube Channels') : __('Your YouTube Channel')}
          subtitle={
            <span>
              {hasPendingTransfers &&
                __('Your videos are currently being transferred. There is nothing else for you to do.')}
              {transferEnabled && !hasPendingTransfers && __('Your videos are ready to be transferred.')}
              {!transferEnabled && !hasPendingTransfers && __('Please check back later.')}
            </span>
          }
          body={
            <section>
              {youtubeChannels.map((channel, index) => {
                const {
                  lbry_channel_name: channelName,
                  channel_claim_id: claimId,
                  status_token: statusToken,
                } = channel;
                const url = buildURI({ channelName, channelClaimId: claimId });
                const transferState = getMessage(channel);
                return (
                  <div key={url} className="card--inline">
                    {claimId ? (
                      <ClaimPreview
                        uri={url}
                        actions={<span className="help">{transferState}</span>}
                        properties={false}
                      />
                    ) : (
                      <p className="section--padded">
                        <I18nMessage
                          tokens={{
                            statusLink: <Button button="link" href={STATUS_URL + statusToken} label={__('here')} />,
                            channelName,
                          }}
                        >
                          %channelName% is not ready to be transferred. You can check the status %statusLink% or check
                          back later.
                        </I18nMessage>
                      </p>
                    )}
                  </div>
                );
              })}
              {videosImported && (
                <div className="section help">{__('%complete% / %total% videos transferred', { complete, total })}</div>
              )}
            </section>
          }
          actions={
            transferEnabled ? (
              <div className="card__actions">
                <Button
                  button="primary"
                  disabled={youtubeImportPending}
                  onClick={claimChannels}
                  label={youtubeChannels.length > 1 ? __('Claim Channels') : __('Claim Channel')}
                />
                <Button button="link" label={__('Learn more')} href="https://lbry.com/faq/youtube#transfer" />
              </div>
            ) : !hideChannelLink ? (
              <div className="card__actions">
                <Button button="primary" navigate={`/$/${PAGES.CHANNELS}`} label={__('View Your Channels')} />
              </div>
            ) : (
              false
            )
          }
        />
      </div>
    )
  );
}
