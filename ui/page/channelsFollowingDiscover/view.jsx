// @flow
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import React from 'react';
import Page from 'component/page';
import Button from 'component/button';
import ClaimTilesDiscover from 'component/claimTilesDiscover';

type Props = {};

type RowDataItem = {
  title: string,
  link?: string,
  help?: any,
  options?: {},
};

function ChannelsFollowingDiscover(props: Props) {
  let rowData: Array<RowDataItem> = [];

  rowData.push({
    title: 'Top Channels On LBRY',
    link: `/$/${PAGES.DISCOVER}`,
    options: {
      pageSize: 12,
      claimType: 'channel',
      orderBy: ['trending_global', 'trending_mixed'],
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

export default ChannelsFollowingDiscover;
