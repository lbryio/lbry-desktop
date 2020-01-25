// @flow
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import React from 'react';
import moment from 'moment';
import Page from 'component/page';
import Button from 'component/button';
import ClaimTilesDiscover from 'component/claimTilesDiscover';
import Icon from 'component/common/icon';
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
  const showAuthenticatedRows = authenticated || !IS_WEB;
  let rowData: Array<RowDataItem> = [];

  if (!showAuthenticatedRows) {
    rowData.push(
      {
        title: 'Trending On LBRY',
        link: `/$/${PAGES.DISCOVER}`,
      },
      {
        title: 'Top Channels On LBRY',
        options: {
          orderBy: ['effective_amount'],
          claimType: 'channel',
        },
      }
    );
  }

  if (showAuthenticatedRows) {
    if (subscribedChannels && subscribedChannels.length > 0) {
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

    if (followedTags.length === 0) {
      rowData.push({
        title: 'Trending On LBRY',
        link: `/$/${PAGES.DISCOVER}`,
        options: {
          pageSize: subscribedChannels.length > 0 ? 4 : 8,
        },
      });
    }

    if (followedTags.length > 0 && followedTags.length < 5) {
      const followedRows = followedTags.map((tag: Tag) => ({
        title: `Trending for #${toCapitalCase(tag.name)}`,
        link: `/$/${PAGES.TAGS}?t=${tag.name}`,
        options: {
          pageSize: 4,
          tags: [tag.name],
        },
      }));
      rowData.push(...followedRows);
    }

    if (followedTags.length > 4) {
      rowData.push({
        title: 'Trending For Your Tags',
        link: `/$/${PAGES.TAGS_FOLLOWING}`,
        options: {
          tags: followedTags.map(tag => tag.name),
        },
      });
    }
  }

  // Everyone
  rowData.push(
    {
      title: 'Top Content Last Week',
      link: `/$/${PAGES.DISCOVER}?&type=top&time=week`,
      options: {
        orderBy: ['effective_amount'],
        pageSize: 4,
        claimType: 'stream',
        releaseTime: `>${Math.floor(
          moment()
            .subtract(1, 'week')
            .startOf('day')
            .unix()
        )}`,
      },
    },
    {
      title: '#HomePageCageMatch',
      link: `/$/${PAGES.TAGS}?t=homepagecagematch&type=top&time=all`,
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
    }
  );

  if (!showAuthenticatedRows) {
    rowData.push({
      title: '#lbry',
      link: `/$/${PAGES.TAGS}?t=lbry&type=top&time=all`,
      options: {
        tags: ['lbry'],
        orderBy: ['effective_amount'],
        pageSize: 4,
      },
    });
  }

  if (showAuthenticatedRows) {
    rowData.push({
      title: 'Trending On LBRY',
      link: `/$/${PAGES.DISCOVER}`,
    });
  }

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
