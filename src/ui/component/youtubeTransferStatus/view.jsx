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

const LBRY_YT_URL = 'https://lbry.com/youtube/status/';
const NOT_TRANSFERED = 'not_transferred';
const PENDING_TRANSFER = 'pending_transfer';
const COMPLETED_TRANSFER = 'completed_transfer';

export default function YoutubeTransferStatus(props: Props) {
  const { youtubeChannels, ytImportPending, claimChannels, videosImported, checkYoutubeTransfer, updateUser } = props;

  const hasChannels = youtubeChannels && youtubeChannels.length;
  const transferEnabled = youtubeChannels && youtubeChannels.some(el => el.transferable === true);
  const transferComplete =
    youtubeChannels &&
    youtubeChannels.some(({ transfer_state: transferState }) => transferState === COMPLETED_TRANSFER);

  let youtubeUrls =
    youtubeChannels &&
    youtubeChannels.map(
      ({ lbry_channel_name: channelName, channel_claim_id: claimId }) => `lbry://${channelName}#${claimId}`
    );

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
        case NOT_TRANSFERED:
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
    if (!transferComplete) {
      checkYoutubeTransfer();

      let interval = setInterval(() => {
        checkYoutubeTransfer();
        updateUser();
      }, 60 * 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [transferComplete, checkYoutubeTransfer, updateUser]);

  return (
    hasChannels &&
    !transferComplete && (
      <div>
        <Card
          title={youtubeUrls.length > 1 ? __('Your YouTube Channels') : __('Your YouTube Channel')}
          subtitle={
            <span>
              {__('Your videos are currently being transferred. There is nothing else for you to do.')}{' '}
              <Button button="link" href={LBRY_YT_URL} label={__('Learn more')} />.
            </span>
          }
          body={
            <section>
              {youtubeUrls.map((url, index) => {
                const channel = youtubeChannels[index];
                const transferState = getMessage(channel);
                return (
                  <div
                    key={url}
                    style={{ border: '1px solid #ccc', borderRadius: 'var(--card-radius)', marginBottom: '1rem' }}
                  >
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
