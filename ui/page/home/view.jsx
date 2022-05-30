// @flow
import React from 'react';
import classnames from 'classnames';

import { getSortedRowData } from './helper';
import { ENABLE_NO_SOURCE_CLAIMS } from 'config';
import * as ICONS from 'constants/icons';
import * as MODALS from 'constants/modal_types';
import * as PAGES from 'constants/pages';
import Page from 'component/page';
import Button from 'component/button';
import ClaimTilesDiscover from 'component/claimTilesDiscover';
import ClaimPreviewTile from 'component/claimPreviewTile';
import Icon from 'component/common/icon';
import WaitUntilOnPage from 'component/common/wait-until-on-page';
import RecommendedPersonal from 'component/recommendedPersonal';
import Yrbl from 'component/yrbl';
import { useIsLargeScreen, useIsMobile } from 'effects/use-screensize';
import { GetLinksData } from 'util/buildHomepage';
import { getLivestreamUris } from 'util/livestream';
import ScheduledStreams from 'component/scheduledStreams';
import { splitBySeparator } from 'util/lbryURI';
import Ads from 'web/component/ads';
import AdsBanner from 'web/component/adsBanner';
import Meme from 'web/component/meme';

const CATEGORY_LIVESTREAM_LIMIT = 3;

type HomepageOrder = { active: ?Array<string>, hidden: ?Array<string> };

type Props = {
  authenticated: boolean,
  followedTags: Array<Tag>,
  subscribedChannels: Array<Subscription>,
  showNsfw: boolean,
  homepageData: any,
  homepageMeme: ?{ text: string, url: string },
  homepageFetched: boolean,
  activeLivestreams: any,
  doFetchActiveLivestreams: () => void,
  fetchingActiveLivestreams: boolean,
  hideScheduledLivestreams: boolean,
  homepageOrder: HomepageOrder,
  doOpenModal: (id: string, ?{}) => void,
  hasMembership: ?boolean,
  hasPremiumPlus: boolean,
  currentTheme: string,
};

function HomePage(props: Props) {
  const {
    followedTags,
    subscribedChannels,
    authenticated,
    showNsfw,
    homepageData,
    homepageMeme,
    homepageFetched,
    activeLivestreams,
    doFetchActiveLivestreams,
    fetchingActiveLivestreams,
    hideScheduledLivestreams,
    homepageOrder,
    doOpenModal,
    hasMembership,
    hasPremiumPlus,
    currentTheme,
  } = props;

  const showPersonalizedChannels = (authenticated || !IS_WEB) && subscribedChannels && subscribedChannels.length > 0;
  const showPersonalizedTags = (authenticated || !IS_WEB) && followedTags && followedTags.length > 0;
  const showIndividualTags = showPersonalizedTags && followedTags.length < 5;
  const isLargeScreen = useIsLargeScreen();
  const isMobileScreen = useIsMobile();
  const subscriptionChannelIds = subscribedChannels.map((sub) => splitBySeparator(sub.uri)[1]);

  const rowData: Array<RowDataItem> = GetLinksData(
    homepageData,
    isLargeScreen,
    true,
    authenticated,
    showPersonalizedChannels,
    showPersonalizedTags,
    subscribedChannels,
    followedTags,
    showIndividualTags,
    showNsfw
  );

  const sortedRowData: Array<RowDataItem> = getSortedRowData(authenticated, hasMembership, homepageOrder, rowData);

  type SectionHeaderProps = {
    title: string,
    navigate?: string,
    icon?: string,
    help?: string,
  };

  const SectionHeader = ({ title, navigate = '/', icon = '', help }: SectionHeaderProps) => {
    return (
      <h1 className="claim-grid__header">
        <Button navigate={navigate} button="link">
          <Icon className="claim-grid__header-icon" sectionIcon icon={icon} size={20} />
          <span className="claim-grid__title">{title}</span>
          {help}
        </Button>
      </h1>
    );
  };

  const CustomizeHomepage = () => {
    return (
      <Button
        button="link"
        iconRight={ICONS.SETTINGS}
        onClick={() => doOpenModal(MODALS.CUSTOMIZE_HOMEPAGE)}
        title={__('Sort and customize your homepage')}
        label={__('Customize --[Short label for "Customize Homepage"]--')}
      />
    );
  };

  function getRowElements(id, title, route, link, icon, help, options, index, pinUrls, pinnedClaimIds) {
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
        prefixUris={getLivestreamUris(activeLivestreams, options.channelIds).slice(
          0,
          id === 'FOLLOWING' ? undefined : CATEGORY_LIVESTREAM_LIMIT
        )}
        pins={{ urls: pinUrls, claimIds: pinnedClaimIds }}
        injectedItem={index === 0 && !hasPremiumPlus && { node: <Ads small type="video" tileLayout /> }}
        forceShowReposts={id !== 'FOLLOWING'}
        loading={id === 'FOLLOWING' ? fetchingActiveLivestreams : false}
      />
    );

    const HeaderArea = () => {
      function resolveTitleOverride(title: string) {
        return title === 'Recent From Following' ? 'Following' : title;
      }

      return (
        <>
          {title && typeof title === 'string' && (
            <div className="homePage-wrapper__section-title">
              <SectionHeader title={__(resolveTitleOverride(title))} navigate={route || link} icon={icon} help={help} />
              {index === 0 && <CustomizeHomepage />}
            </div>
          )}
        </>
      );
    };

    return (
      <div
        key={title}
        className={classnames('claim-grid__wrapper', {
          'hide-ribbon': link !== `/$/${PAGES.CHANNELS_FOLLOWING}`,
        })}
      >
        {id === 'FYP' ? (
          <RecommendedPersonal header={<HeaderArea />} />
        ) : (
          <>
            <HeaderArea />
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
            {isMobileScreen && <AdsBanner key={`${currentTheme}:${title}`} />}
            {!isMobileScreen && (index === 0 || index % 2 === 0) && <AdsBanner key={`${currentTheme}:${title}`} />}
          </>
        )}
      </div>
    );
  }

  React.useEffect(() => {
    doFetchActiveLivestreams();
  }, []);

  return (
    <Page className="homePage-wrapper" fullWidthPage>
      <Meme meme={homepageMeme} />

      {!fetchingActiveLivestreams && (
        <>
          {authenticated && subscriptionChannelIds.length > 0 && !hideScheduledLivestreams && (
            <ScheduledStreams
              channelIds={subscriptionChannelIds}
              tileLayout
              liveUris={getLivestreamUris(activeLivestreams, subscriptionChannelIds)}
              limitClaimsPerChannel={2}
            />
          )}
        </>
      )}

      {sortedRowData.length === 0 && authenticated && homepageFetched && (
        <div className="empty--centered">
          <Yrbl
            alwaysShow
            title={__('Clean as a whistle! --[title for empty homepage]--')}
            actions={<CustomizeHomepage />}
          />
        </div>
      )}

      {sortedRowData.map(
        ({ id, title, route, link, icon, help, pinnedUrls: pinUrls, pinnedClaimIds, options = {} }, index) => {
          return getRowElements(id, title, route, link, icon, help, options, index, pinUrls, pinnedClaimIds);
        }
      )}
    </Page>
  );
}

export default HomePage;
