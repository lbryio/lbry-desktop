// @flow
import { SHOW_ADS, DOMAIN, SIMPLE_SITE } from 'config';
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import * as CS from 'constants/claim_search';
import React, { useRef } from 'react';
import Page from 'component/page';
import ClaimListDiscover from 'component/claimListDiscover';
import Button from 'component/button';
import useHover from 'effects/use-hover';
import { useIsMobile } from 'effects/use-screensize';
import analytics from 'analytics';
import HiddenNsfw from 'component/common/hidden-nsfw';
import Icon from 'component/common/icon';
import Ads, { injectAd } from 'web/component/ads';
import LbcSymbol from 'component/common/lbc-symbol';
import I18nMessage from 'component/i18nMessage';
import moment from 'moment';
import LivestreamSection from './livestreamSection';

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
  isAuthenticated: boolean,
  tileLayout: boolean,
  activeLivestreams: ?LivestreamInfo,
  doFetchActiveLivestreams: (orderBy: ?Array<string>, lang: ?Array<string>) => void,
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
    isAuthenticated,
    tileLayout,
    activeLivestreams,
    doFetchActiveLivestreams,
    dynamicRouteProps,
  } = props;

  const buttonRef = useRef();
  const isHovering = useHover(buttonRef);
  const isMobile = useIsMobile();

  const urlParams = new URLSearchParams(search);
  const langParam = urlParams.get(CS.LANGUAGE_KEY) || null;
  const claimType = urlParams.get('claim_type');
  const tagsQuery = urlParams.get('t') || null;
  const tags = tagsQuery ? tagsQuery.split(',') : null;
  const repostedClaimIsResolved = repostedUri && repostedClaim;

  const discoverIcon = SIMPLE_SITE ? ICONS.WILD_WEST : ICONS.DISCOVER;
  const discoverLabel = SIMPLE_SITE ? __('Wild West') : __('All Content');
  // Eventually allow more than one tag on this page
  // Restricting to one to make follow/unfollow simpler
  const tag = (tags && tags[0]) || null;
  const channelIds =
    (dynamicRouteProps && dynamicRouteProps.options && dynamicRouteProps.options.channelIds) || undefined;

  const isFollowing = followedTags.map(({ name }) => name).includes(tag);
  let label = isFollowing ? __('Following --[button label indicating a channel has been followed]--') : __('Follow');
  if (isHovering && isFollowing) {
    label = __('Unfollow');
  }

  const includeLivestreams = !tagsQuery;

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

    if (tag && !isMobile) {
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
    if (includeLivestreams) {
      return (
        <LivestreamSection
          tileLayout={repostedUri ? false : tileLayout}
          channelIds={channelIds}
          activeLivestreams={activeLivestreams}
          doFetchActiveLivestreams={doFetchActiveLivestreams}
          languageSetting={languageSetting}
          searchInLanguage={searchInLanguage}
          langParam={langParam}
        />
      );
    }
    return null;
  }

  function getPins(routeProps) {
    if (routeProps && routeProps.pinnedUrls) {
      return {
        urls: routeProps.pinnedUrls,
        onlyPinForOrder: CS.ORDER_BY_TRENDING,
      };
    }
  }

  React.useEffect(() => {
    if (repostedUri && !repostedClaimIsResolved) {
      doResolveUri(repostedUri);
    }
  }, [repostedUri, repostedClaimIsResolved, doResolveUri]);

  function handleFollowClick() {
    if (tag) {
      doToggleTagFollowDesktop(tag);

      const nowFollowing = !isFollowing;
      analytics.tagFollowEvent(tag, nowFollowing, 'tag-page');
    }
  }

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
        <Icon icon={(dynamicRouteProps && dynamicRouteProps.icon) || discoverIcon} size={10} />
        {(dynamicRouteProps && __(`${dynamicRouteProps.title}`)) || discoverLabel}
      </span>
    );
  }

  React.useEffect(() => {
    if (isAuthenticated || !SHOW_ADS || window.location.pathname === `/$/${PAGES.WILD_WEST}`) {
      return;
    }
    injectAd();
  }, [isAuthenticated]);

  return (
    <Page noFooter fullWidthPage={tileLayout} className="main__discover">
      <Ads type="homepage" />
      <ClaimListDiscover
        pins={getPins(dynamicRouteProps)}
        hideFilters={SIMPLE_SITE ? !(dynamicRouteProps || tags) : undefined}
        header={repostedUri ? <span /> : undefined}
        subSection={getSubSection()}
        tileLayout={repostedUri ? false : tileLayout}
        defaultOrderBy={SIMPLE_SITE ? (dynamicRouteProps ? undefined : CS.ORDER_BY_TRENDING) : undefined}
        claimType={claimType ? [claimType] : undefined}
        headerLabel={headerLabel}
        tags={tags}
        hiddenNsfwMessage={<HiddenNsfw type="page" />}
        repostedClaimId={repostedClaim ? repostedClaim.claim_id : null}
        injectedItem={
          SHOW_ADS && IS_WEB ? (SIMPLE_SITE ? false : !isAuthenticated && <Ads small type={'video'} />) : false
        }
        // Assume wild west page if no dynamicRouteProps
        // Not a very good solution, but just doing it for now
        // until we are sure this page will stay around
        // TODO: find a better way to determine discover / wild west vs other modes release times
        // for now including && !tags so that
        releaseTime={
          SIMPLE_SITE
            ? !dynamicRouteProps && !tags && `>${Math.floor(moment().subtract(1, 'day').startOf('week').unix())}`
            : undefined
        }
        feeAmount={SIMPLE_SITE ? !dynamicRouteProps && CS.FEE_AMOUNT_ANY : undefined}
        channelIds={channelIds}
        limitClaimsPerChannel={
          SIMPLE_SITE
            ? (dynamicRouteProps && dynamicRouteProps.options && dynamicRouteProps.options.limitClaimsPerChannel) || 3
            : 3
        }
        meta={getMeta()}
        hasSource
      />
    </Page>
  );
}

export default DiscoverPage;
