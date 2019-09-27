// @flow
import * as React from 'react';
import Button from 'component/button';
import ClaimPreview from 'component/claimPreview';
import Card from 'component/common/card';

type Props = {
  youtubeChannels: Array<any>,
  ytImportPending: boolean,
  claimChannels: () => void,
  updateUser: () => void,
  checkYoutubeTransfer: () => void,
  videosImported: ?Array<number>, // [currentAmountImported, totalAmountToImport]
};

const NOT_TRANSFERRED = 'not_transferred';
const PENDING_TRANSFER = 'pending_transfer';
const COMPLETED_TRANSFER = 'completed_transfer';

export default function YoutubeTransferStatus(props: Props) {
  const { youtubeChannels, ytImportPending, claimChannels, videosImported, checkYoutubeTransfer, updateUser } = props;
  const hasChannels = youtubeChannels && youtubeChannels.length;

  let transferEnabled = false;
  let transferStarted = false;
  let transferComplete = false;
  if (hasChannels) {
    for (var i = 0; i < youtubeChannels.length; i++) {
      const { transfer_state: transferState, transferable } = youtubeChannels[i];
      if (transferable) {
        transferEnabled = true;
      }

      if (transferState === COMPLETED_TRANSFER) {
        transferComplete = true;
      }

      if (transferState === PENDING_TRANSFER) {
        transferStarted = true;
      }
    }
  }

  let total;
  let complete;
  if (!transferComplete && videosImported) {
    complete = videosImported[0];
    total = videosImported[1];
  }

  function getMessage(channel) {
    const { transferable, transfer_state: transferState, sync_status: syncStatus } = channel;
    if (!transferable) {
      switch (transferState) {
        case NOT_TRANSFERRED:
          return syncStatus[0].toUpperCase() + syncStatus.slice(1);
        case PENDING_TRANSFER:
          return __('Transfer in progress');
        case COMPLETED_TRANSFER:
          return __('Completed transfer');
      }
    } else {
      return __('Ready to transfer');
    }
  }

  React.useEffect(() => {
    // If a channel is transferrable, theres nothing to check
    if (transferStarted && !transferComplete) {
      checkYoutubeTransfer();

      let interval = setInterval(() => {
        checkYoutubeTransfer();
        updateUser();
      }, 60 * 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [transferComplete, transferStarted, checkYoutubeTransfer, updateUser]);

  return (
    hasChannels &&
    !transferComplete && (
      <div>
        <Card
          title={youtubeChannels.length > 1 ? __('Your YouTube Channels') : __('Your YouTube Channel')}
          subtitle={
            <span>
              {transferStarted
                ? __('Your videos are currently being transferred. There is nothing else for you to do.')
                : __('Your videos are ready to be transferred.')}
            </span>
          }
          body={
            <section>
              {youtubeChannels.map((channel, index) => {
                const { lbry_channel_name: channelName, channel_claim_id: claimId } = channel;
                const url = `lbry://${channelName}#${claimId}`;
                const transferState = getMessage(channel);
                return (
                  <div key={url} className="card--inline">
                    <ClaimPreview uri={url} actions={<span className="help">{transferState}</span>} properties={''} />
                  </div>
                );
              })}
              {videosImported && (
                <div className="section help">
                  {complete} / {total} {__('videos transferred')}
                </div>
              )}
            </section>
          }
          actions={
            transferEnabled &&
            !ytImportPending && (
              <div className="card__actions">
                <Button button="primary" onClick={claimChannels} label={__('Claim Channels')} />
                <Button button="link" label={__('Learn more')} href="https://lbry.com/faq/youtube#transfer" />
              </div>
            )
          }
        />
      </div>
    )
  );
}
