// @flow
import * as React from 'react';
import YoutubeChannelListItem from './internal/youtubeChannel';
import Button from 'component/button';

type Props = {
  ytChannels: Array<any>,
  claimChannels: () => void,
  updateUser: () => void,
};

export default function YoutubeChannelList(props: Props) {
  const { ytChannels, claimChannels, updateUser } = props;
  const hasChannels = ytChannels && ytChannels.length;
  const transferEnabled = ytChannels && ytChannels.some(el => el.transferable === true);
  return (
    hasChannels && (
      <section className="card card--section">
        <h2 className="card__title--between">
          <span>Synced Youtube Channels</span>
          <div className="card__actions--inline">
            <Button button="inverse" onClick={updateUser} label={__('Refresh')} />
          </div>
        </h2>
        {transferEnabled && !IS_WEB && (
          <p className="card__subtitle">LBRY is currently holding channels you can take control of.</p>
        )}
        {!transferEnabled && !IS_WEB && (
          <p className="card__subtitle">LBRY is currently holding channels but none are ready for transfer yet.</p>
        )}
        {IS_WEB && (
          <p className="card__subtitle">
            {__(`LBRY.tv can't import accounts yet. `)}
            <Button button="link" label={__('Download the app')} href="https://lbry.com/get" />
          </p>
        )}
        <table className="table">
          <thead>
            <tr>
              <th>{__('Youtube Name')}</th>
              <th>{__('LBRY Name')} </th>
              <th>{__('Sync Status')} </th>
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
        <div className="card__actions">
          <Button disabled={IS_WEB} button="primary" onClick={claimChannels} label={__('Claim Channels')} />
          <Button button="link" label={__('Learn more')} href="https://lbry.com/faq/youtube#transfer" />
        </div>
      </section>
    )
  );
}
