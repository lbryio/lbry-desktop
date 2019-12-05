// @flow
import React, { useEffect } from 'react';
import ClaimList from 'component/claimList';
import Page from 'component/page';
import Button from 'component/button';
import YoutubeTransferStatus from 'component/youtubeTransferStatus';
import Spinner from 'component/spinner';
import * as PAGES from 'constants/pages';
import * as ICONS from 'constants/icons';
import * as MODALS from 'constants/modal_types';
import { doOpenModal } from '../../redux/actions/app';

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
      {hasYoutubeChannels && <YoutubeTransferStatus hideChannelLink />}

      {channels && Boolean(channels.length) && (
        <div className="card">
          <ClaimList
            header={__('Your Channels')}
            loading={fetchingChannels}
            uris={channels.map(channel => channel.permanent_url)}
            headerAltControls={
              <Button
                iconSize={20}
                label={__('New Channel')}
                icon={ICONS.NEW_CHANNEL}
                onClick={() => doOpenModal(MODALS.CREATE_CHANNEL)}
              />
            }
          />
        </div>
      )}
      {!(channels && channels.length) && (
        <React.Fragment>
          {!fetchingChannels ? (
            <section className="main--empty">
              <div className=" section--small">
                <h2 className="section__title--large">{__('No Channels Created Yet')}</h2>

                <div className="section__actions">
                  <Button
                    iconSize={20}
                    label={__('New Channel')}
                    button="link"
                    icon={ICONS.NEW_CHANNEL}
                    navigate={`/$/${PAGES.CHANNEL_CREATE}`}
                  />
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
