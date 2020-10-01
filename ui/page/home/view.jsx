// @flow
import type { RowDataItem } from 'homepage';
import * as ICONS from 'constants/icons';
import classnames from 'classnames';
import React from 'react';
import Page from 'component/page';
import Button from 'component/button';
import ClaimTilesDiscover from 'component/claimTilesDiscover';
import getHomepage from 'homepage';
import Icon from 'component/common/icon';
import { useIsLargeScreen } from 'effects/use-screensize';

type Props = {
  authenticated: boolean,
  followedTags: Array<Tag>,
  subscribedChannels: Array<Subscription>,
  showNsfw: boolean,
};

function HomePage(props: Props) {
  const { followedTags, subscribedChannels, authenticated, showNsfw } = props;
  const isLargeScreen = useIsLargeScreen();
  const showPersonalizedChannels = (authenticated || !IS_WEB) && subscribedChannels && subscribedChannels.length > 0;
  const showPersonalizedTags = (authenticated || !IS_WEB) && followedTags && followedTags.length > 0;
  const showIndividualTags = showPersonalizedTags && followedTags.length < 5;
  const rowData: Array<RowDataItem> = getHomepage(
    authenticated,
    showPersonalizedChannels,
    showPersonalizedTags,
    subscribedChannels,
    followedTags,
    showIndividualTags,
    showNsfw
  );

  return (
    <Page fullWidthPage>
      {rowData.map(({ title, route, link, help, icon, options = {}, hideRepostLabel = false }, index) => (
        <div key={title} className="claim-grid__wrapper">
          {index === 0 ? (
            <span
              className={classnames('claim-grid__title', {
                'claim-grid__title--first': index === 0,
              })}
            >
              {title}
            </span>
          ) : (
            <h1 className="claim-grid__header">
              <Button navigate={route || link} button="link">
                {icon && <Icon className="claim-grid__header-icon" sectionIcon icon={icon} size={20} />}
                <span className="claim-grid__title">{title}</span>
                {help}
              </Button>
            </h1>
          )}

          <ClaimTilesDiscover {...options} pageSize={isLargeScreen ? options.pageSize * (3 / 2) : options.pageSize} />
          {link && (
            <Button
              className="claim-grid__title--secondary"
              button="link"
              navigate={route || link}
              iconRight={ICONS.ARROW_RIGHT}
              label={__('View More')}
            />
          )}
        </div>
      ))}
    </Page>
  );
}

export default HomePage;
