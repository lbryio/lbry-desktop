// @flow
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import * as CS from 'constants/claim_search';
import React from 'react';
import moment from 'moment';
import Page from 'component/page';
import Button from 'component/button';
import ClaimTilesDiscover from 'component/claimTilesDiscover';
import Icon from 'component/common/icon';
import I18nMessage from 'component/i18nMessage';
import { parseURI } from 'lbry-redux';
import { toCapitalCase } from 'util/string';

type Props = {
  authenticated: boolean,
  followedTags: Array<Tag>,
  subscribedChannels: Array<Subscription>,
};

type RowDataItem = {
  title: string,
  link?: string,
  help?: any,
  options?: {},
};

function HomePage(props: Props) {
  const { followedTags, subscribedChannels, authenticated } = props;
  const showPersonalizedChannels = (authenticated || !IS_WEB) && subscribedChannels && subscribedChannels.length > 0;
  const showPersonalizedTags = (authenticated || !IS_WEB) && followedTags && followedTags.length > 0;
  const showIndividualTags = showPersonalizedTags && followedTags.length < 5;
  let rowData: Array<RowDataItem> = [];

  // if you are following channels, always show that first
  if (showPersonalizedChannels) {
    let releaseTime = `>${Math.floor(
      moment()
        .subtract(1, 'year')
        .startOf('week')
        .unix()
    )}`;

    // Warning - hack below
    // If users are following more than 20 channels or tags, limit results to stuff less than 6 months old
    // This helps with timeout issues for users that are following a ton of stuff
    // https://github.com/lbryio/lbry-sdk/issues/2420
    if (subscribedChannels.length > 20) {
      releaseTime = `>${Math.floor(
        moment()
          .subtract(6, 'months')
          .startOf('week')
          .unix()
      )}`;
    }

    rowData.push({
      title: 'Recent From Following',
      link: `/$/${PAGES.CHANNELS_FOLLOWING}`,
      options: {
        orderBy: ['release_time'],
        releaseTime: releaseTime,
        pageSize: subscribedChannels.length > 3 ? 8 : 4,
        channelIds: subscribedChannels.map(subscription => {
          const { channelClaimId } = parseURI(subscription.uri);
          return channelClaimId;
        }),
      },
    });
  }

  if (showPersonalizedTags && !showIndividualTags) {
    rowData.push({
      title: 'Trending For Your Tags',
      link: `/$/${PAGES.TAGS_FOLLOWING}`,
      options: {
        tags: followedTags.map(tag => tag.name),
        claimType: ['stream'],
      },
    });
  }

  if (showPersonalizedTags && showIndividualTags) {
    followedTags.forEach((tag: Tag) => {
      rowData.push({
        title: `Trending for #${toCapitalCase(tag.name)}`,
        link: `/$/${PAGES.DISCOVER}?t=${tag.name}`,
        options: {
          pageSize: 4,
          tags: [tag.name],
          claimType: ['stream'],
        },
      });
    });
  }

  rowData.push({
    title: 'Top Content from Today',
    link: `/$/${PAGES.DISCOVER}?${CS.ORDER_BY_KEY}=${CS.ORDER_BY_TOP}&${CS.FRESH_KEY}=${CS.FRESH_DAY}`,
    options: {
      pageSize: showPersonalizedChannels || showPersonalizedTags ? 4 : 8,
      orderBy: ['effective_amount'],
      claimType: ['stream'],
      releaseTime: `>${Math.floor(
        moment()
          .subtract(1, 'day')
          .startOf('day')
          .unix()
      )}`,
    },
  });

  rowData.push({
    title: 'Trending On LBRY',
    link: `/$/${PAGES.DISCOVER}`,
    options: {
      pageSize: showPersonalizedChannels || showPersonalizedTags ? 4 : 8,
    },
  });

  if (!showPersonalizedChannels) {
    rowData.push({
      title: 'Top Channels On LBRY',
      link: `/$/${PAGES.DISCOVER}?claim_type=channel&${CS.ORDER_BY_KEY}=${CS.ORDER_BY_TOP}&${CS.FRESH_KEY}=${CS.FRESH_ALL}`,
      options: {
        orderBy: ['effective_amount'],
        claimType: ['channel'],
      },
    });
  }

  rowData.push(
    {
      title: 'Trending Classics',
      link: `/$/${PAGES.DISCOVER}?${CS.ORDER_BY_KEY}=${CS.ORDER_BY_TRENDING}&${CS.FRESH_KEY}=${CS.FRESH_WEEK}`,
      options: {
        pageSize: 4,
        claimType: ['stream'],
        releaseTime: `<${Math.floor(
          moment()
            .subtract(6, 'month')
            .startOf('day')
            .unix()
        )}`,
      },
    }
    /* the cagematch will return in some form! - Jeremy
  {
    title: '#HomePageCageMatch',
    link: `/$/${PAGES.DISCOVER}?t=homepagecagematch&${CS.ORDER_BY_KEY}=${CS.ORDER_BY_TOP}&${CS.FRESH_KEY}=${
      CS.FRESH_ALL
    }`,
    help: (
      <div className="claim-grid__help">
        <Icon
          icon={ICONS.HELP}
          tooltip
          customTooltipText={__(
            'This is an experiment, and may be removed in the future. Publish something with the #homepagecagematch tag to battle for the top spot on the home page!'
          )}
        />
      </div>
    ),
    options: {
      tags: ['homepagecagematch'],
      orderBy: ['effective_amount'],
      timestamp: `>${Math.floor(
        moment()
          .subtract(1, 'week')
          .startOf('day')
          .unix()
      )}`,
    },
    } */
  );

  rowData.push({
    title: 'Latest From @lbrycast',
    link: `/@lbrycast:4`,
    options: {
      orderBy: ['release_time'],
      pageSize: 4,
      channelIds: ['4c29f8b013adea4d5cca1861fb2161d5089613ea'],
    },
  });

  rowData.push({
    title: 'Latest From @lbry',
    link: `/@lbry:3f`,
    options: {
      orderBy: ['release_time'],
      pageSize: 4,
      channelIds: ['3fda836a92faaceedfe398225fb9b2ee2ed1f01a'],
    },
  });

  return (
    <Page>
      {(authenticated || !IS_WEB) && !subscribedChannels.length && (
        <div className="notice-message">
          <h1 className="section__title">{__('LBRY Works Better If You Are Following Channels')}</h1>
          <p className="section__subtitle">
            <I18nMessage
              tokens={{
                discover_channels_link: (
                  <Button
                    button="link"
                    navigate={`/$/${PAGES.CHANNELS_FOLLOWING_DISCOVER}`}
                    label={__('Find new channels to follow')}
                  />
                ),
              }}
            >
              You aren't currently following any channels. %discover_channels_link%.
            </I18nMessage>
          </p>
        </div>
      )}
      {rowData.map(({ title, link, help, options = {} }) => (
        <div key={title} className="claim-grid__wrapper">
          <h1 className="section__actions">
            {link ? (
              <Button
                className="claim-grid__title"
                button="link"
                navigate={link}
                iconRight={ICONS.ARROW_RIGHT}
                label={title}
              />
            ) : (
              <span className="claim-grid__title">{title}</span>
            )}
            {help}
          </h1>

          <ClaimTilesDiscover {...options} />
        </div>
      ))}
    </Page>
  );
}

export default HomePage;
