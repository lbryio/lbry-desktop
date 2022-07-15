// @flow
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import React from 'react';
import { Lbryio } from 'lbryinc';
import ClaimPreview from 'component/claimPreview';
import Card from 'component/common/card';
import Spinner from 'component/spinner';
import Icon from 'component/common/icon';
import Button from 'component/button';
import Yrbl from 'component/yrbl';
import { useHistory } from 'react-router-dom';
import analytics from 'analytics';

type Props = {
  claim: ?ChannelClaim,
  fetchingChannels: boolean,
};

const UNAUTHENTICATED_ERROR = 'unauthenticated';
const GENERIC_ERROR = 'error';

export default function CreatorAnalytics(props: Props) {
  const { claim } = props;
  const history = useHistory();
  const [stats, setStats] = React.useState();
  const [error, setError] = React.useState();
  const [fetchingStats, setFetchingStats] = React.useState(false);
  const claimId = claim && claim.claim_id;
  // TODO: put this back when hubs are fixed
  // const channelHasClaims = claim && claim.meta && claim.meta.claims_in_channel && claim.meta.claims_in_channel > 0 || true;
  const channelHasClaims = true;

  React.useEffect(() => {
    setStats(null);
  }, [claimId]);

  const channelForEffect = JSON.stringify(claim);
  React.useEffect(() => {
    if (claimId && channelForEffect && channelHasClaims) {
      setFetchingStats(true);
      Lbryio.call('channel', 'stats', { claim_id: claimId })
        .then((res) => {
          setFetchingStats(false);
          setStats(res);
        })
        .catch((error) => {
          if (error.response.status === 401) {
            setError(UNAUTHENTICATED_ERROR);
            const channelToSend = JSON.parse(channelForEffect);
            analytics.apiLogPublish(channelToSend);
          } else {
            setError(GENERIC_ERROR);
          }

          setFetchingStats(false);
        });
    }
  }, [claimId, channelForEffect, channelHasClaims, setFetchingStats, setStats]);

  return (
    <React.Fragment>
      {!stats && (
        <div className="main--empty">
          {fetchingStats ? (
            <Spinner delayed />
          ) : (
            <div>
              {error && (
                <Yrbl
                  type="sad"
                  title={error === GENERIC_ERROR ? __('No stats found') : __('Error fetching stats')}
                  subtitle={
                    error === GENERIC_ERROR
                      ? __(
                          'There are no stats for this channel yet, it will take a few views. Make sure you are signed in with the correct email and have data sharing turned on.'
                        )
                      : __(
                          "You are not able to see this channel's stats. Make sure you are signed in with the correct email and have data sharing turned on."
                        )
                  }
                />
              )}

              {!error && !channelHasClaims ? (
                <Yrbl
                  type="sad"
                  title={__("You haven't uploaded anything")}
                  subtitle={__('Upload something to start tracking your stats!')}
                  actions={
                    <div className="section__actions">
                      <Button
                        button="primary"
                        label={__('Upload Something')}
                        onClick={() => {
                          history.push(`/$/${PAGES.UPLOAD}`);
                        }}
                      />
                    </div>
                  }
                />
              ) : (
                <Yrbl
                  title={
                    channelHasClaims
                      ? __('No recent uploads')
                      : __("You haven't uploaded anything with this channel yet!")
                  }
                  actions={
                    <div className="section__actions">
                      <Button
                        button="primary"
                        label={__('Upload Something')}
                        onClick={() => history.push(`/$/${PAGES.UPLOAD}`)}
                      />
                    </div>
                  }
                />
              )}
            </div>
          )}
        </div>
      )}

      {stats && (
        <div className="section">
          <div className="columns">
            <Card
              iconColor
              title={<span>{__('%follower_count% followers', { follower_count: stats.ChannelSubs })}</span>}
              icon={ICONS.SUBSCRIBE}
              subtitle={
                <div className="card__data-subtitle">
                  <span>
                    {0 > -1 && '+'}{' '}
                    {__('%follower_count_weekly_change% this week', {
                      follower_count_weekly_change: stats.ChannelSubChange || 0,
                    })}
                  </span>
                  {stats.ChannelSubChange > 0 && <Icon icon={ICONS.TRENDING} iconColor="green" size={18} />}
                </div>
              }
            />
            <Card
              icon={ICONS.EYE}
              title={<span>{__('%all_content_views% views', { all_content_views: stats.AllContentViews })}</span>}
              subtitle={
                <div className="card__data-subtitle">
                  <span>
                    {__('+ %all_content_views_weekly_change% this week', {
                      all_content_views_weekly_change: stats.AllContentViewChange || 0,
                    })}
                  </span>
                  {stats.AllContentViewChange > 0 && <Icon icon={ICONS.TRENDING} iconColor="green" size={18} />}
                </div>
              }
            />
          </div>

          {/* <Card
            iconColor
            className="section"
            title={<span>{__('%lbc_received% LBRY Credits Earned', { lbc_received: stats.AllLBCReceived })}</span>}
            icon={ICONS.REWARDS}
            subtitle={
              <React.Fragment>
                <div className="card__data-subtitle">
                  <span>
                    {'+'}{' '}
                    {__('%lbc_received_changed% this week', {
                      lbc_received_changed: stats.LBCReceivedChange || 0,
                    })}
                  </span>
                  {stats.LBCReceivedChange > 0 && <Icon icon={ICONS.TRENDING} iconColor="green" size={18} />}
                </div>
                <p className="help">
                  {__(
                    "Earnings may also include any LBC you've sent yourself or added as support. We are working on making this more accurate. Check your wallet page for the correct total balance."
                  )}
                </p>
              </React.Fragment>
            }
          /> */}

          {stats.VideoURITopNew ? (
            <Card
              className="section"
              title={__('Most viewed recent content')}
              body={
                <React.Fragment>
                  <div className="card--inline">
                    <ClaimPreview uri={stats.VideoURITopNew} />
                  </div>
                  <div className="section__subtitle card__data-subtitle">
                    <span>
                      {stats.VideoViewsTopNew === 1
                        ? __('1 view')
                        : __('%view_count% views - %view_count_change% this week', {
                            view_count: stats.VideoViewsTopNew,
                            view_count_change: stats.VideoViewChangeTopNew,
                          })}
                    </span>
                    {stats.VideoViewChangeTopNew > 0 && <Icon icon={ICONS.TRENDING} iconColor="green" size={18} />}
                  </div>
                </React.Fragment>
              }
            />
          ) : (
            <Card
              className="section"
              title={__('Your recent content')}
              subtitle={
                !stats.VideoURITopNew &&
                __("No recent uploads found for this channel. Upload something new and track how it's performing here.")
              }
              actions={
                <div className="section__actions">
                  <Button
                    button="primary"
                    icon={ICONS.PUBLISH}
                    label={__('Upload')}
                    onClick={() => history.push(`/$/${PAGES.UPLOAD}`)}
                  />
                </div>
              }
            />
          )}

          {stats.VideoURITopCommentNew && stats.VideoCommentTopCommentNew > 0 && (
            <Card
              className="section"
              title={__('Most commented recent content')}
              body={
                <React.Fragment>
                  <div className="card--inline">
                    <ClaimPreview uri={stats.VideoURITopCommentNew} />
                  </div>
                  <div className="section__subtitle card__data-subtitle">
                    <span>
                      {stats.VideoCommentTopCommentNew === 1
                        ? __('1 comment')
                        : __('%comment_count% comments - %comment_count_change% this week', {
                            comment_count: stats.VideoCommentTopCommentNew,
                            comment_count_change: stats.VideoCommentChangeTopCommentNew,
                          })}
                    </span>
                    {stats.VideoCommentChangeTopCommentNew > 0 && (
                      <Icon icon={ICONS.TRENDING} iconColor="green" size={18} />
                    )}
                  </div>
                </React.Fragment>
              }
            />
          )}

          <Card
            className="section"
            title={__('Most viewed content all time')}
            body={
              <React.Fragment>
                <div className="card--inline">
                  <ClaimPreview uri={stats.VideoURITopAllTime} />
                </div>
                <div className="section__subtitle card__data-subtitle">
                  <span>
                    {__('%all_time_top_views% views - %all_time_views_weekly_change% this week', {
                      all_time_top_views: stats.VideoViewsTopAllTime,
                      all_time_views_weekly_change: stats.VideoViewChangeTopAllTime,
                    })}
                  </span>
                  {stats.VideoViewChangeTopAllTime > 0 && <Icon icon={ICONS.TRENDING} iconColor="green" size={18} />}
                </div>
              </React.Fragment>
            }
          />
        </div>
      )}
    </React.Fragment>
  );
}
