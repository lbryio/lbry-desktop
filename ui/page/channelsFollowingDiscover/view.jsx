// @flow
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import React from 'react';
import Page from 'component/page';
import Button from 'component/button';
import ClaimTilesDiscover from 'component/claimTilesDiscover';
import { toCapitalCase } from 'util/string';

type Props = {
  followedTags: Array<Tag>,
};

type RowDataItem = {
  title: string,
  link?: string,
  help?: any,
  options?: {},
};

function ChannelsFollowingDiscover(props: Props) {
  const { followedTags } = props;
  let rowData: Array<RowDataItem> = [];

  rowData.push({
    title: 'Top Channels Of All Time',
    options: {
      pageSize: 8,
      claimType: 'channel',
      orderBy: ['effective_amount'],
    },
  });

  rowData.push({
    title: 'Latest From @lbrycast',
    link: `/@lbrycast:4`,
    options: {
      orderBy: ['release_time'],
      pageSize: 8,
      channelIds: ['4c29f8b013adea4d5cca1861fb2161d5089613ea'],
    },
  });

  rowData.push({
    title: 'Trending Channels',
    options: {
      pageSize: 4,
      claimType: 'channel',
      orderBy: ['trending_group', 'trending_mixed'],
    },
  });

  if (followedTags.length > 0 && followedTags.length < 5) {
    const followedRows = followedTags.map((tag: Tag) => ({
      title: `Trending for #${toCapitalCase(tag.name)}`,
      link: `/$/${PAGES.TAGS}?t=${tag.name}`,
      options: {
        claimType: 'channel',
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
        claimType: 'channel',
        tags: followedTags.map(tag => tag.name),
      },
    });
  }

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

export default ChannelsFollowingDiscover;
