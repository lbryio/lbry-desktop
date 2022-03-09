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
import { useHistory } from 'react-router';
import useGetUserMemberships from 'effects/use-get-user-memberships';

type Props = {
  channelUrls: Array<string>,
  fetchChannelListMine: () => void,
  fetchingChannels: boolean,
  youtubeChannels: ?Array<any>,
  doSetActiveChannel: (string) => void,
  pendingChannels: Array<string>,
  claimsByUri: { [string]: any },
  doFetchUserMemberships: (claimIdCsv: string) => void,
};

export default function ChannelsPage(props: Props) {
  const {
    channelUrls,
    fetchChannelListMine,
    fetchingChannels,
    youtubeChannels,
    doSetActiveChannel,
    pendingChannels,
    claimsByUri,
    doFetchUserMemberships,
  } = props;
  const [rewardData, setRewardData] = React.useState();
  const hasYoutubeChannels = youtubeChannels && Boolean(youtubeChannels.length);

  const shouldFetchUserMemberships = true;
  useGetUserMemberships(shouldFetchUserMemberships, channelUrls, claimsByUri, doFetchUserMemberships);

  const { push } = useHistory();

  useEffect(() => {
    fetchChannelListMine();
  }, [fetchChannelListMine]);

  useEffect(() => {
    Lbryio.call('user_rewards', 'view_rate').then((data) => setRewardData(data));
  }, [setRewardData]);

  return (
    <Page className="channelsPage-wrapper">
      <div className="card-stack">
        {hasYoutubeChannels && <YoutubeTransferStatus hideChannelLink />}

        {channelUrls && Boolean(channelUrls.length) && (
          <ClaimList
            showMemberBadge
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

              if (channelRewardData && !pendingChannels.includes(claim.permanent_url)) {
                return (
                  <span className="claim-preview__custom-properties">
                    <span className="help--inline">
                      {__('Earnings per view')}{' '}
                      <HelpLink href="https://odysee.com/@OdyseeHelp:b/Monetization-of-Content:3" />
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
