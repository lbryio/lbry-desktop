// @flow
import * as React from 'react';
import YoutubeChannelListItem from './internal/youtubeChannel';
export default function YoutubeChannelList(props: Props) {
  const { ytChannels } = props;
  return (
    ytChannels &&
    ytChannels.length && (
      <section className="card card--section">
        <h2 className="card__title">Channels</h2>
        <p className="card__subtitle">You got em</p>
        <table className="table">
          <thead>
            <tr>
              <th>{__('Youtube Name')}</th>
              <th>{__('LBRY Name')} </th>
              <th>{__('Sync Status')} </th>
              <th>{__('Channel ClaimId')}</th>
              <th>{__('Transfer Status')}</th>
            </tr>
          </thead>
          <tbody>
            {ytChannels.map(channel => (
              <YoutubeChannelListItem
                key={`yt${channel.yt_channel_name}${channel.lbry_channel_name}`}
                channel={channel}
              />
            ))}
          </tbody>
        </table>
      </section>
    )
  );
}
