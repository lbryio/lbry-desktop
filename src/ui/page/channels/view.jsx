// @flow
import React, { useEffect } from 'react';
import ClaimList from 'component/claimList';
import Page from 'component/page';
import Button from 'component/button';
import YoutubeTransferStatus from 'component/youtubeTransferStatus';

type Props = {
  channels: Array<ChannelClaim>,
  fetchChannelListMine: () => void,
  fetchingChannels: boolean,
  youtubeChannels: ?Array<any>,
};

export default function ChannelsPage(props: Props) {
  const { channels, fetchChannelListMine, fetchingChannels, youtubeChannels } = props;
  const hasYoutubeChannels = youtubeChannels && Boolean(youtubeChannels.length);
  const hasPendingChannels = channels && channels.some(channel => channel.confirmations === -1);

  useEffect(() => {
    fetchChannelListMine();

    let interval;
    if (hasPendingChannels) {
      interval = setInterval(() => {
        fetchChannelListMine();
      }, 5000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [fetchChannelListMine, hasPendingChannels]);

  return (
    <Page>
      {/* @if TARGET='app' */}
      {hasYoutubeChannels && <YoutubeTransferStatus hideChannelLink />}
      {/* @endif */}

      {channels && channels.length ? (
        <div className="card">
          <ClaimList
            header={__('Your Channels')}
            loading={fetchingChannels}
            uris={channels.map(channel => channel.permanent_url)}
          />
        </div>
      ) : (
        <section className="main--empty">
          <div className=" section--small">
            <h2 className="section__title--large">{__('No Channels Created Yet')}</h2>

            <div className="section__actions">
              <Button button="primary" navigate="/$/publish" label={__('Create A Channel')} />
            </div>
          </div>
        </section>
      )}
    </Page>
  );
}
