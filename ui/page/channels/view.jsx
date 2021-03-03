// @flow
import * as ICONS from 'constants/icons';
import React, { useEffect } from 'react';
import { Lbryio } from 'lbryinc';
import ClaimList from 'component/claimList';
import Page from 'component/page';
import Button from 'component/button';
import YoutubeTransferStatus from 'component/youtubeTransferStatus';
import Spinner from 'component/spinner';
import Yrbl from 'component/yrbl';
import LbcSymbol from 'component/common/lbc-symbol';
import * as PAGES from 'constants/pages';
import HelpLink from 'component/common/help-link';

type Props = {
  channels: Array<ChannelClaim>,
  channelUrls: Array<string>,
  fetchChannelListMine: () => void,
  fetchingChannels: boolean,
  youtubeChannels: ?Array<any>,
};

export default function ChannelsPage(props: Props) {
  const { channels, channelUrls, fetchChannelListMine, fetchingChannels, youtubeChannels } = props;
  const [rewardData, setRewardData] = React.useState();
  const hasYoutubeChannels = youtubeChannels && Boolean(youtubeChannels.length);
  const hasPendingChannels = channels && channels.some((channel) => channel.confirmations < 0);

  useEffect(() => {
    fetchChannelListMine();
  }, [fetchChannelListMine, hasPendingChannels]);

  useEffect(() => {
    Lbryio.call('user_rewards', 'view_rate').then((data) => setRewardData(data));
  }, [setRewardData]);

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
                    navigate={`/$/${PAGES.CREATOR_DASHBOARD}?channel=${encodeURIComponent(claim.canonical_url)}`}
                  />
                </div>
              );
            }}
            renderProperties={(claim) => {
              const claimsInChannel = claim.meta.claims_in_channel;
              if (!claim || claimsInChannel === 0) {
                return null;
              }

              const channelRewardData =
                rewardData &&
                rewardData.rates &&
                rewardData.rates.find((data) => {
                  return data.channel_claim_id === claim.claim_id;
                });

              if (channelRewardData) {
                return (
                  <span className="claim-preview__custom-properties">
                    <span className="help--inline">
                      {__('Earnings per view')} <HelpLink href="https://lbry.com/faq/view-rewards" />
                    </span>

                    <span>
                      <LbcSymbol postfix={channelRewardData.view_rate.toFixed(2)} />
                    </span>
                  </span>
                );
              } else {
                return null;
              }
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
