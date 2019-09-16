// @flow
import React from 'react';
import Button from 'component/button';
type Channel = {
  yt_channel_name: string,
  lbry_channel_name: string,
  channel_claim_id: string,
  sync_status: string,
  status_token: string,
  transferable: boolean,
  transfer_state: string,
  publish_to_address: Array<string>,
};

type Props = {
  channel: Channel,
};

export default function YoutubeChannelItem(props: Props) {
  const {
    yt_channel_name: ytName,
    lbry_channel_name: lbryName,
    sync_status: syncStatus,
    status_token: statusToken,
    transferable,
    transfer_state: transferState,
  } = props.channel;

  const LBRY_YT_URL = 'https://lbry.com/youtube/status/';
  const NOT_TRANSFERED = 'not_transferred';
  const PENDING_TRANSFER = 'pending_transfer';
  const COMPLETED_TRANSFER = 'completed_transfer';

  function renderSwitch(param) {
    switch (param) {
      case NOT_TRANSFERED:
        return __('Not Transferred');
      case PENDING_TRANSFER:
        return __('Pending Transfer');
      case COMPLETED_TRANSFER:
        return __('Completed Transfer');
    }
  }

  // | Youtube Name | LBRY Name | SyncStatus | TransferStatus |

  return (
    <tr>
      <td>{ytName}</td>
      <td>
        <Button button={'link'} navigate={`lbry://${lbryName}`} label={lbryName} />
      </td>
      <td>
        <Button button={'link'} href={`${LBRY_YT_URL}${statusToken}`} label={syncStatus} />
      </td>
      <td>{transferable ? renderSwitch(transferState) : __('Not Transferable')}</td>
    </tr>
  );
}
