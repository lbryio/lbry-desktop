// @flow
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import React from 'react';
import { Lbryio } from 'lbryinc';
import ChannelSelector from 'component/channelSelector';
import ClaimPreview from 'component/claimPreview';
import Card from 'component/common/card';
import Spinner from 'component/spinner';
import Icon from 'component/common/icon';
import usePersistedState from 'effects/use-persisted-state';
import Button from 'component/button';
import Yrbl from 'component/yrbl';
import { useHistory } from 'react-router-dom';

type Props = {
  channels: Array<ChannelClaim>,
  fetchingChannels: boolean,
  prepareEdit: string => void,
};

export default function CreatorDashboardPage(props: Props) {
  const { channels, prepareEdit } = props;
  const history = useHistory();
  const [stats, setStats] = React.useState();
  const [selectedChannelUrl, setSelectedChannelUrl] = usePersistedState('analytics-selected-channel');
  const [fetchingStats, setFetchingStats] = React.useState(false);
  const hasChannels = channels && channels.length > 0;
  const firstChannel = hasChannels && channels[0];
  const firstChannelUrl = firstChannel && (firstChannel.canonical_url || firstChannel.permanent_url); // permanent_url is needed for pending publishes
  const selectedChannelClaim =
    channels &&
    channels.find(claim => claim.canonical_url === selectedChannelUrl || claim.permanent_url === selectedChannelUrl);
  const selectedChannelClaimId = selectedChannelClaim && selectedChannelClaim.claim_id;
  const channelFoundForSelectedChannelUrl =
    channels &&
    channels.find(channel => {
      return selectedChannelUrl === channel.canonical_url || selectedChannelUrl === channel.permanent_url;
    });

  React.useEffect(() => {
    // set default channel
    if ((!selectedChannelUrl || !channelFoundForSelectedChannelUrl) && firstChannelUrl) {
      setSelectedChannelUrl(firstChannelUrl);
    }
  }, [selectedChannelUrl, firstChannelUrl, channelFoundForSelectedChannelUrl]);

  React.useEffect(() => {
    if (selectedChannelClaimId) {
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
  }, [selectedChannelClaimId, setFetchingStats, setStats]);

  return (
    <React.Fragment>
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
      {!fetchingStats && !stats && (
        <section className="main--empty">
          <Yrbl
            title={__("You haven't published anything with this channel yet!")}
            subtitle={
              <Button
                button="primary"
                label={__('Publish Something')}
                onClick={() => {
                  if (selectedChannelClaim) {
                    prepareEdit(selectedChannelClaim.name);
                    history.push(`/$/${PAGES.PUBLISH}`);
                  }
                }}
              />
            }
          />
        </section>
      )}
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
                          {stats.VideoViewsTopAllTime} views - {stats.VideoViewChangeTopAllTime} this week
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
    </React.Fragment>
  );
}
