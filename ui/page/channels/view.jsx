// @flow
import * as ICONS from 'constants/icons';
import React, { useEffect } from 'react';
import ClaimList from 'component/claimList';
import Page from 'component/page';
import Button from 'component/button';
import YoutubeTransferStatus from 'component/youtubeTransferStatus';
import Spinner from 'component/spinner';
import Card from 'component/common/card';
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
          <Card
            title={__('Your Channels')}
            titleActions={
              <>
                <Button
                  button="secondary"
                  icon={ICONS.CHANNEL}
                  label={__('New Channel')}
                  navigate={`/$/${PAGES.CHANNEL_NEW}`}
                />
              </>
            }
            isBodyList
            body={<ClaimList isCardBody loading={fetchingChannels} uris={channelUrls} />}
          />
        )}
      </div>

      {!(channelUrls && channelUrls.length) && (
        <React.Fragment>
          {!fetchingChannels ? (
            <section className="main--empty">
              <div className=" section--small">
                <h2 className="section__title--large">{__('No Channels Created Yet')}</h2>

                <div className="section__actions">
                  <Button button="primary" label={__('New Channel')} navigate={`/$/${PAGES.CHANNEL_NEW}`} />
                </div>
              </div>
            </section>
          ) : (
            <section className="main--empty">
              <div className=" section--small">
                <h2 className="section__title--small">
                  {__('Checking for channels')}
                  <Spinner type="small" />
                </h2>
              </div>
            </section>
          )}
        </React.Fragment>
      )}
    </Page>
  );
}
