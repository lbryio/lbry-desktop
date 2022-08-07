// @flow
import * as ICONS from 'constants/icons';
import React, { useEffect } from 'react';
import ClaimList from 'component/claimList';
import Page from 'component/page';
import Button from 'component/button';
import Spinner from 'component/spinner';
import Yrbl from 'component/yrbl';
import * as PAGES from 'constants/pages';
import { useHistory } from 'react-router';

type Props = {
  channelUrls: Array<string>,
  fetchChannelListMine: () => void,
  fetchingChannels: boolean,
  doSetActiveChannel: (string) => void,
};

export default function ChannelsPage(props: Props) {
  const { channelUrls, fetchChannelListMine, fetchingChannels, doSetActiveChannel } = props;

  const { push } = useHistory();

  useEffect(() => {
    fetchChannelListMine();
  }, [fetchChannelListMine]);

  return (
    <Page className="channelsPage-wrapper">
      <div className="card-stack">
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
            renderActions={(claim) => {
              const claimsInChannel = claim.meta.claims_in_channel;
              return claimsInChannel === 0 ? (
                <span />
              ) : (
                <div className="section__actions">
                  <Button
                    button="alt"
                    icon={ICONS.ANALYTICS}
                    label={__('Analytics')}
                    onClick={() => {
                      doSetActiveChannel(claim.claim_id);
                      push(`/$/${PAGES.CREATOR_DASHBOARD}`);
                    }}
                  />
                </div>
              );
            }}
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
                    <Button button="primary" label={__('Create Channel')} navigate={`/$/${PAGES.CHANNEL_NEW}`} />
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
