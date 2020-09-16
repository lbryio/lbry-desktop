// @flow
import * as ICONS from 'constants/icons';
import React, { useEffect } from 'react';
import ClaimList from 'component/claimList';
import Page from 'component/page';
import Button from 'component/button';
import YoutubeTransferStatus from 'component/youtubeTransferStatus';
import Spinner from 'component/spinner';
import Yrbl from 'component/yrbl';
import * as PAGES from 'constants/pages';

type Props = {
  channels: Array<ChannelClaim>,
  channelUrls: Array<string>,
  fetchChannelListMine: () => void,
  fetchingChannels: boolean,
  youtubeChannels: ?Array<any>,
};

export default function ChannelsPage(props: Props) {
  const { channels, channelUrls, fetchChannelListMine, fetchingChannels, youtubeChannels } = props;
  const hasYoutubeChannels = youtubeChannels && Boolean(youtubeChannels.length);
  const hasPendingChannels = channels && channels.some(channel => channel.confirmations < 0);

  useEffect(() => {
    fetchChannelListMine();
  }, [fetchChannelListMine, hasPendingChannels]);

  return (
    <Page>
      <div className="card-stack">
        {hasYoutubeChannels && <YoutubeTransferStatus hideChannelLink />}

        {channelUrls && Boolean(channelUrls.length) && (
          <ClaimList
            header={<h1 className="section__title">{__('Your channels')}</h1>}
            headerAltControls={
              <Button
                button="secondary"
                icon={ICONS.CHANNEL}
                label={__('New Channel')}
                navigate={`/$/${PAGES.CHANNEL_NEW}`}
              />
            }
            loading={fetchingChannels}
            uris={channelUrls}
          />
        )}
      </div>

      {!(channelUrls && channelUrls.length) && (
        <React.Fragment>
          {!fetchingChannels ? (
            <section className="main--empty">
              <Yrbl
                title={__('No channels')}
                subtitle={__("You haven't created a channel yet. All of your beautiful channels will be listed here!")}
                actions={
                  <div className="section__actions">
                    <Button button="primary" label={__('New Channel')} navigate={`/$/${PAGES.CHANNEL_NEW}`} />
                  </div>
                }
              />
            </section>
          ) : (
            <section className="main--empty">
              <Spinner delayed />
            </section>
          )}
        </React.Fragment>
      )}
    </Page>
  );
}
