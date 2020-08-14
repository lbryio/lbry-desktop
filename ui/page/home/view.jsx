// @flow
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import React from 'react';
import Page from 'component/page';
import Button from 'component/button';
import ClaimTilesDiscover from 'component/claimTilesDiscover';
import I18nMessage from 'component/i18nMessage';
import getHomepage from 'homepage';

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

  const rowData: Array<RowDataItem> = getHomepage(
    authenticated,
    showPersonalizedChannels,
    showPersonalizedTags,
    subscribedChannels,
    followedTags,
    showIndividualTags
  );

  return (
    <Page homePage>
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
            <span className="claim-grid__title">{title}</span>
            {help}
          </h1>

          <ClaimTilesDiscover {...options} />
          {link && (
            <Button
              className="claim-grid__title--secondary"
              button="link"
              navigate={link}
              iconRight={ICONS.ARROW_RIGHT}
              label={title}
            />
          )}
        </div>
      ))}
    </Page>
  );
}

export default HomePage;
