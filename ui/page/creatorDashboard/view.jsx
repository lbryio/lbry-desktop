// @flow
import * as ICONS from 'constants/icons';
import React from 'react';
import Page from 'component/page';
import { Lbryio } from 'lbryinc';
import ChannelSelector from 'component/channelSelector';
import ClaimPreview from 'component/claimPreview';
import Card from 'component/common/card';
import Spinner from 'component/spinner';
import Icon from 'component/common/icon';
import usePersistedState from 'effects/use-persisted-state';

type Props = {
  channels: Array<ChannelClaim>,
};

export default function CreatorDashboardPage(props: Props) {
  const { channels } = props;
  const [stats, setStats] = React.useState();
  const [selectedChannelUrl, setSelectedChannelUrl] = usePersistedState('analytics-selected-channel');
  const [fetchingStats, setFetchingStats] = React.useState(false);
  const topChannel =
    channels &&
    channels.reduce((top, channel) => {
      const topClaimCount = (top && top.meta && top.meta.claims_in_channel) || 0;
      const currentClaimCount = (channel && channel.meta && channel.meta.claims_in_channel) || 0;
      // $FlowFixMe
      return topClaimCount >= currentClaimCount ? top : channel.canonical_url;
    });

  const selectedChannelClaim = channels && channels.find(claim => claim.canonical_url === selectedChannelUrl);
  const selectedChannelClaimId = selectedChannelClaim && selectedChannelClaim.claim_id;

  React.useEffect(() => {
    // set default channel
    if (!selectedChannelUrl && topChannel) {
      setSelectedChannelUrl(topChannel);
    }
  }, [selectedChannelUrl, topChannel]);

  React.useEffect(() => {
    if (selectedChannelClaimId && !fetchingStats) {
      setFetchingStats(true);
      Lbryio.call('reports', 'content', { claim_id: selectedChannelClaimId })
        .then(res => {
          setFetchingStats(false);
          setStats(res);
        })
        .catch(() => {
          setFetchingStats(false);
        });
    }
  }, [selectedChannelClaimId, setFetchingStats]);

  return (
    <Page>
      <div className="section">
        <ChannelSelector
          selectedChannelUrl={selectedChannelUrl}
          onChannelSelect={newChannelUrl => {
            setStats(null);
            setSelectedChannelUrl(newChannelUrl);
          }}
        />
      </div>
      {fetchingStats && !stats && (
        <div className="main--empty">
          <Spinner delayed />
        </div>
      )}
      {!fetchingStats && !stats && <div className="main--empty">This channel doesn't have any publishes</div>}
      {stats && (
        <div className="section">
          <div className="columns">
            <Card
              iconColor
              title={<span>{stats.ChannelSubs} followers</span>}
              icon={ICONS.SUBSCRIBE}
              subtitle={
                <div className="card__data-subtitle">
                  <span>
                    {stats.ChannelSubChange > 0 ? '+' : '-'} {stats.ChannelSubChange || 0} this week
                  </span>
                  {stats.ChannelSubChange > 0 && <Icon icon={ICONS.SUPPORT} iconColor="green" size={18} />}
                </div>
              }
            />
            <Card
              icon={ICONS.EYE}
              title={<span>{stats.AllContentViews} views</span>}
              subtitle={<span>{stats.AllContentViewsChange || 0} this week</span>}
            />
          </div>

          <Card
            title={
              <div className="card__data-subtitle">
                <span>Most Viewed Claim</span>
              </div>
            }
            body={
              <React.Fragment>
                <div className="card--inline">
                  <ClaimPreview
                    uri={stats.VideoURITopAllTime}
                    properties={
                      <div className="section__subtitle card__data-subtitle">
                        <span>
                          {stats.VideoViewsTopAllTime} views - {stats.VideoViewChangeTopAllTime} new
                        </span>
                        {stats.VideoViewChangeTopAllTime > 0 && (
                          <Icon icon={ICONS.SUPPORT} iconColor="green" size={18} />
                        )}
                      </div>
                    }
                  />
                </div>
              </React.Fragment>
            }
          />
        </div>
      )}
    </Page>
  );
}
