// @flow
import React, { useRef } from 'react';
import classnames from 'classnames';
import { DOMAIN, SIMPLE_SITE } from 'config';
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import * as CS from 'constants/claim_search';
import Page from 'component/page';
import ClaimListDiscover from 'component/claimListDiscover';
import Button from 'component/button';
import { ClaimSearchFilterContext } from 'contexts/claimSearchFilterContext';
import useHover from 'effects/use-hover';
import { useIsMobile } from 'effects/use-screensize';
import analytics from 'analytics';
import HiddenNsfw from 'component/common/hidden-nsfw';
import Icon from 'component/common/icon';
import Ads from 'web/component/ads';
import LbcSymbol from 'component/common/lbc-symbol';
import I18nMessage from 'component/i18nMessage';
import moment from 'moment';
import LivestreamSection from './livestreamSection';

const CATEGORY_CONTENT_TYPES_FILTER = CS.CONTENT_TYPES.filter((x) => x !== CS.CLAIM_REPOST);

type Props = {
  dynamicRouteProps: RowDataItem,
  location: { search: string },
  followedTags: Array<Tag>,
  repostedUri: string,
  repostedClaim: ?GenericClaim,
  languageSetting: string,
  searchInLanguage: boolean,
  doToggleTagFollowDesktop: (string) => void,
  doResolveUri: (string) => void,
  tileLayout: boolean,
  activeLivestreams: ?LivestreamInfo,
  doFetchActiveLivestreams: (orderBy: ?Array<string>, lang: ?Array<string>) => void,
  hasPremiumPlus: boolean,
};

function DiscoverPage(props: Props) {
  const {
    location: { search },
    followedTags,
    repostedClaim,
    repostedUri,
    languageSetting,
    searchInLanguage,
    doToggleTagFollowDesktop,
    doResolveUri,
    tileLayout,
    activeLivestreams,
    doFetchActiveLivestreams,
    dynamicRouteProps,
    hasPremiumPlus,
  } = props;

  const buttonRef = useRef();
  const isHovering = useHover(buttonRef);
  const isMobile = useIsMobile();
  const isWildWest = dynamicRouteProps && dynamicRouteProps.id === 'WILD_WEST';
  const isCategory = Boolean(dynamicRouteProps);

  const urlParams = new URLSearchParams(search);
  const langParam = urlParams.get(CS.LANGUAGE_KEY) || null;
  const claimType = urlParams.get('claim_type');
  const tagsQuery = urlParams.get('t') || null;
  const freshnessParam = urlParams.get(CS.FRESH_KEY);
  const orderParam = urlParams.get(CS.ORDER_BY_KEY);
  const tags = tagsQuery ? tagsQuery.split(',') : null;
  const repostedClaimIsResolved = repostedUri && repostedClaim;
  const hideRepostRibbon = isCategory && !isWildWest;

  // Eventually allow more than one tag on this page
  // Restricting to one to make follow/unfollow simpler
  const tag = (tags && tags[0]) || null;
  const channelIds = dynamicRouteProps?.options?.channelIds || undefined;
  const excludedChannelIds = dynamicRouteProps?.options?.excludedChannelIds || undefined;

  const isFollowing = React.useMemo(() => followedTags.some((t) => t.name === tag), [tag, followedTags]);

  const filters = { contentTypes: isCategory && !isWildWest ? CATEGORY_CONTENT_TYPES_FILTER : CS.CONTENT_TYPES };

  // **************************************************************************
  // **************************************************************************

  function getMeta() {
    if (!dynamicRouteProps) {
      return (
        <a
          className="help"
          href="https://odysee.com/@OdyseeHelp:b/trending:50"
          title={__('Learn more about Credits on %DOMAIN%', { DOMAIN })}
        >
          <I18nMessage tokens={{ lbc: <LbcSymbol /> }}>Results boosted by %lbc%</I18nMessage>
        </a>
      );
    }

    // NOTE: the if-block below will never run because a Tag page is also
    // "!dynamicRouteProps". However, using the existing channel Follow button
    // to follow a tag looks confusing, so I'll leave things as-is for now.

    if (tag && !isMobile) {
      let label = isFollowing
        ? __('Following --[button label indicating a channel has been followed]--')
        : __('Follow');
      if (isHovering && isFollowing) {
        label = __('Unfollow');
      }

      return (
        <Button
          ref={buttonRef}
          button="alt"
          icon={ICONS.SUBSCRIBE}
          iconColor="red"
          onClick={handleFollowClick}
          requiresAuth={IS_WEB}
          label={label}
        />
      );
    }

    return null;
  }

  function getSubSection() {
    const includeLivestreams = !tagsQuery;
    if (includeLivestreams) {
      return (
        <LivestreamSection
          tileLayout={repostedUri ? false : tileLayout}
          channelIds={channelIds}
          excludedChannelIds={excludedChannelIds}
          activeLivestreams={activeLivestreams}
          doFetchActiveLivestreams={doFetchActiveLivestreams}
          searchLanguages={dynamicRouteProps?.options?.searchLanguages}
          languageSetting={languageSetting}
          searchInLanguage={searchInLanguage}
          langParam={langParam}
        />
      );
    }
    return null;
  }

  function getPins(routeProps) {
    if (routeProps && (routeProps.pinnedUrls || routeProps.pinnedClaimIds)) {
      return {
        urls: routeProps.pinnedUrls,
        claimIds: routeProps.pinnedClaimIds,
        onlyPinForOrder: CS.ORDER_BY_TRENDING,
      };
    }
  }

  function getHeaderLabel() {
    let headerLabel;
    if (repostedClaim) {
      headerLabel = __('Reposts of %uri%', { uri: repostedUri });
    } else if (tag) {
      headerLabel = (
        <span>
          <Icon icon={ICONS.TAG} size={10} />
          {(tag === CS.TAGS_ALL && __('All Content')) || (tag === CS.TAGS_FOLLOWED && __('Followed Tags')) || tag}

          <Button
            className="claim-search__tags-link"
            button="link"
            label={__('Manage Tags')}
            navigate={`/$/${PAGES.TAGS_FOLLOWING_MANAGE}`}
          />
        </span>
      );
    } else {
      headerLabel = (
        <span>
          <Icon icon={(dynamicRouteProps && dynamicRouteProps.icon) || ICONS.DISCOVER} size={10} />
          {(dynamicRouteProps && __(`${dynamicRouteProps.title}`)) || __('All Content')}
        </span>
      );
    }
    return headerLabel;
  }

  function getAds() {
    return (
      !isWildWest &&
      !hasPremiumPlus && {
        node: (index, lastVisibleIndex, pageSize) => {
          if (pageSize && index < pageSize) {
            return index === lastVisibleIndex ? <Ads small type="video" tileLayout={tileLayout} /> : null;
          } else {
            return index % (pageSize * 2) === 0 ? <Ads small type="video" tileLayout={tileLayout} /> : null;
          }
        },
      }
    );
  }

  function getReleaseTime() {
    const categoryReleaseTime = dynamicRouteProps?.options?.releaseTime;

    if (isWildWest) {
      // The homepage definition currently does not support 'start-of-week', so
      // continue to hardcode here for now.
      return `>${Math.floor(moment().subtract(0, 'hour').startOf('week').unix())}`;
    } else if (categoryReleaseTime) {
      const hasFreshnessOverride = orderParam === CS.ORDER_BY_TOP && freshnessParam !== null;
      if (!hasFreshnessOverride) {
        return categoryReleaseTime;
      }
    }

    return undefined;
  }

  function handleFollowClick() {
    if (tag) {
      doToggleTagFollowDesktop(tag);
      const nowFollowing = !isFollowing;
      analytics.tagFollowEvent(tag, nowFollowing, 'tag-page');
    }
  }

  // **************************************************************************
  // **************************************************************************

  React.useEffect(() => {
    if (repostedUri && !repostedClaimIsResolved) {
      doResolveUri(repostedUri);
    }
  }, [repostedUri, repostedClaimIsResolved, doResolveUri]);

  // **************************************************************************
  // **************************************************************************

  return (
    <Page
      noFooter
      fullWidthPage={tileLayout}
      className={classnames('main__discover', { 'hide-ribbon': hideRepostRibbon })}
    >
      <ClaimSearchFilterContext.Provider value={filters}>
        <ClaimListDiscover
          pins={getPins(dynamicRouteProps)}
          hideFilters={isWildWest ? true : undefined}
          header={repostedUri ? <span /> : undefined}
          subSection={getSubSection()}
          tileLayout={repostedUri ? false : tileLayout}
          defaultOrderBy={isWildWest || tags ? CS.ORDER_BY_TRENDING : undefined}
          claimType={claimType ? [claimType] : undefined}
          defaultStreamType={isCategory && !isWildWest ? [CS.FILE_VIDEO, CS.FILE_AUDIO, CS.FILE_DOCUMENT] : undefined}
          headerLabel={getHeaderLabel()}
          tags={tags}
          hiddenNsfwMessage={<HiddenNsfw type="page" />}
          repostedClaimId={repostedClaim ? repostedClaim.claim_id : null}
          injectedItem={getAds()}
          // TODO: find a better way to determine discover / wild west vs other modes release times
          // for now including && !tags so that
          releaseTime={getReleaseTime()}
          feeAmount={isWildWest || tags ? CS.FEE_AMOUNT_ANY : undefined}
          channelIds={channelIds}
          excludedChannelIds={excludedChannelIds}
          limitClaimsPerChannel={
            SIMPLE_SITE
              ? (dynamicRouteProps && dynamicRouteProps.options && dynamicRouteProps.options.limitClaimsPerChannel) || 3
              : 3
          }
          meta={getMeta()}
          hasSource
          hideRepostsOverride={dynamicRouteProps ? true : undefined}
          searchLanguages={dynamicRouteProps?.options?.searchLanguages}
        />
      </ClaimSearchFilterContext.Provider>
    </Page>
  );
}

export default DiscoverPage;
