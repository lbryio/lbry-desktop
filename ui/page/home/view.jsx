// @flow
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import { SITE_NAME, SIMPLE_SITE, ENABLE_NO_SOURCE_CLAIMS } from 'config';
import React from 'react';
import Page from 'component/page';
import Button from 'component/button';
import ClaimTilesDiscover from 'component/claimTilesDiscover';
import ClaimPreviewTile from 'component/claimPreviewTile';
import Icon from 'component/common/icon';
import WaitUntilOnPage from 'component/common/wait-until-on-page';
import { GetLinksData } from 'util/buildHomepage';
import { getLivestreamUris } from 'util/livestream';

// @if TARGET='web'
import Pixel from 'web/component/pixel';
import Meme from 'web/component/meme';
// @endif

type Props = {
  authenticated: boolean,
  followedTags: Array<Tag>,
  subscribedChannels: Array<Subscription>,
  showNsfw: boolean,
  homepageData: any,
  activeLivestreams: any,
  doFetchActiveLivestreams: () => void,
};

function HomePage(props: Props) {
  const {
    followedTags,
    subscribedChannels,
    authenticated,
    showNsfw,
    homepageData,
    activeLivestreams,
    doFetchActiveLivestreams,
  } = props;
  const showPersonalizedChannels = (authenticated || !IS_WEB) && subscribedChannels && subscribedChannels.length > 0;
  const showPersonalizedTags = (authenticated || !IS_WEB) && followedTags && followedTags.length > 0;
  const showIndividualTags = showPersonalizedTags && followedTags.length < 5;

  const rowData: Array<RowDataItem> = GetLinksData(
    homepageData,
    true,
    authenticated,
    showPersonalizedChannels,
    showPersonalizedTags,
    subscribedChannels,
    followedTags,
    showIndividualTags,
    showNsfw
  );

  function getRowElements(title, route, link, icon, help, options, index, pinUrls) {
    const tilePlaceholder = (
      <ul className="claim-grid">
        {new Array(options.pageSize || 8).fill(1).map((x, i) => (
          <ClaimPreviewTile showNoSourceClaims={ENABLE_NO_SOURCE_CLAIMS} key={i} placeholder />
        ))}
      </ul>
    );

    const claimTiles = (
      <ClaimTilesDiscover
        {...options}
        showNoSourceClaims={ENABLE_NO_SOURCE_CLAIMS}
        hasSource
        prefixUris={getLivestreamUris(activeLivestreams, options.channelIds)}
        pinUrls={pinUrls}
      />
    );

    return (
      <div key={title} className="claim-grid__wrapper">
        {index !== 0 && title && typeof title === 'string' && (
          <h1 className="claim-grid__header">
            <Button navigate={route || link} button="link">
              {icon && <Icon className="claim-grid__header-icon" sectionIcon icon={icon} size={20} />}
              <span className="claim-grid__title">{__(title)}</span>
              {help}
            </Button>
          </h1>
        )}

        {index === 0 && <>{claimTiles}</>}
        {index !== 0 && (
          <WaitUntilOnPage name={title} placeholder={tilePlaceholder} yOffset={800}>
            {claimTiles}
          </WaitUntilOnPage>
        )}

        {(route || link) && (
          <Button
            className="claim-grid__title--secondary"
            button="link"
            navigate={route || link}
            iconRight={ICONS.ARROW_RIGHT}
            label={__('View More')}
          />
        )}
      </div>
    );
  }

  React.useEffect(() => {
    doFetchActiveLivestreams();
  }, []);

  return (
    <Page fullWidthPage>
      {!SIMPLE_SITE && (authenticated || !IS_WEB) && !subscribedChannels.length && (
        <div className="notice-message">
          <h1 className="section__title">
            {__("%SITE_NAME% is more fun if you're following channels", { SITE_NAME })}
          </h1>
          <p className="section__actions">
            <Button
              button="primary"
              navigate={`/$/${PAGES.CHANNELS_FOLLOWING_DISCOVER}`}
              label={__('Find new channels to follow')}
            />
          </p>
        </div>
      )}
      {/* @if TARGET='web' */}
      {SIMPLE_SITE && <Meme />}
      {/* @endif */}
      {rowData.map(({ title, route, link, icon, help, pinnedUrls: pinUrls, options = {} }, index) => {
        // add pins here
        return getRowElements(title, route, link, icon, help, options, index, pinUrls);
      })}
      {/* @if TARGET='web' */}
      <Pixel type={'retargeting'} />
      {/* @endif */}
    </Page>
  );
}

export default HomePage;
