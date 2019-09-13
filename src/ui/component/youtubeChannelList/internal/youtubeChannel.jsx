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
    channel_claim_id: claimId,
    sync_status: syncStatus,
    status_token: statusToken,
    transferable,
    transfer_state: transferState,
    publish_to_address: publishAddresses,
  } = props.channel;
  const LbryYtUrl = 'https://lbry.com/youtube/status/';

  //  <thead>
  //   <tr>
  //    <th>{__('Youtube Name')}</th>
  //    <th>{__('LBRY Name')} </th>
  //    <th>{__('Sync Status')} </th>
  //    <th>{__('Transfer Status')}</th>
  //   </tr>
  //  </thead>
  const doTransfer = () => {};

  return (
    <tr>
      <td>{ytName}</td>
      <td>
        <Button button={'link'} navigate={`lbry://${lbryName}`} label={lbryName} />
      </td>
      <td>
        <Button button={'link'} href={`${LbryYtUrl}${statusToken}`} label={syncStatus} />
      </td>
      <td>{claimId}</td>
      <td>
        {transferable && <Button button={'link'} onClick={doTransfer} label={'Claim It'} />}
        {!transferable && transferState}
      </td>
    </tr>
  );
}
