// @flow
import * as ICONS from 'constants/icons';
import React from 'react';
import ClaimList from 'component/claimList';
import Page from 'component/page';
import Button from 'component/button';
import YoutubeTransferStatus from 'component/youtubeTransferStatus';
import Spinner from 'component/spinner';
import Yrbl from 'component/yrbl';
import LbcSymbol from 'component/common/lbc-symbol';
import * as PAGES from 'constants/pages';
import HelpLink from 'component/common/help-link';
import ChannelSelector from 'component/channelSelector';
import { useHistory } from 'react-router';

type Props = {
  // -- redux --
  channelUrls: Array<string>,
  channelIds: ?ClaimIds,
  fetchingChannels: boolean,
  hasYoutubeChannels: boolean,
  pendingIds: Array<string>,
  viewRateById: {},
  doFetchChannelListMine: () => void,
  doUserViewRateList: () => void,
  doSetActiveChannel: (string) => void,
  doFetchOdyseeMembershipForChannelIds: (claimIds: ClaimIds) => void,
};

export default function ChannelsPage(props: Props) {
  const {
    // -- redux --
    channelUrls,
    channelIds,
    fetchingChannels,
    hasYoutubeChannels,
    pendingIds,
    viewRateById,
    doFetchChannelListMine,
    doUserViewRateList,
    doSetActiveChannel,
    doFetchOdyseeMembershipForChannelIds,
  } = props;

  const hasChannels = Number.isInteger(channelIds?.length);

  React.useEffect(() => {
    if (channelIds) {
      doFetchOdyseeMembershipForChannelIds(channelIds);
      doUserViewRateList();
    } else {
      doFetchChannelListMine();
    }
  }, [channelIds, doFetchChannelListMine, doFetchOdyseeMembershipForChannelIds, doUserViewRateList]);

  const { push } = useHistory();

  if (!hasChannels && !hasYoutubeChannels) {
    return (
      <Page className="channelsPage-wrapper">
        {fetchingChannels ? (
          <div className="main--empty">
            <Spinner delayed />
          </div>
        ) : (
          <Yrbl
            title={__('No channels')}
            subtitle={__("You haven't created a channel yet. All of your beautiful channels will be listed here!")}
            actions={
              <div className="section__actions">
                <Button button="primary" label={__('Create Channel')} navigate={`/$/${PAGES.CHANNEL_NEW}`} />
              </div>
            }
          />
        )}
      </Page>
    );
  }

  return (
    <Page className="channelsPage-wrapper">
      <h1 className="section__title section__title--margin-bottom">{__('Active channel')}</h1>
      <span className="section__subtitle ">{__('Select your default active channel')}</span>
      <ChannelSelector storeSelection />

      <div className="card-stack">
        {hasYoutubeChannels && <YoutubeTransferStatus hideChannelLink />}

        <Button
          button="primary"
          label={__('Sync YouTube Channel')}
          icon={ICONS.YOUTUBE}
          navigate={`/$/${PAGES.YOUTUBE_SYNC}`}
        />

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
          renderProperties={(claim) => {
            const claimsInChannel = claim.meta.claims_in_channel;
            if (!claim || claimsInChannel === 0) {
              return null;
            }

            const channelRewardData = viewRateById[claim.claim_id];

            if (channelRewardData && !pendingIds.includes(claim.claim_id)) {
              return (
                <span className="claim-preview__custom-properties">
                  <span className="help--inline">
                    {__('Earnings per view')} <HelpLink href="https://help.odysee.tv/category-monetization/" />
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
      </div>
    </Page>
  );
}
