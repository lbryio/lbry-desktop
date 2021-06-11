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
import Ads from 'web/component/ads';
import LbcSymbol from 'component/common/lbc-symbol';
import I18nMessage from 'component/i18nMessage';
import useGetLivestreams from 'effects/use-get-livestreams';
import moment from 'moment';

type Props = {
  location: { search: string },
  followedTags: Array<Tag>,
  repostedUri: string,
  repostedClaim: ?GenericClaim,
  doToggleTagFollowDesktop: (string) => void,
  doResolveUri: (string) => void,
  isAuthenticated: boolean,
  dynamicRouteProps: RowDataItem,
  tileLayout: boolean,
};

function DiscoverPage(props: Props) {
  const {
    location: { search },
    followedTags,
    repostedClaim,
    repostedUri,
    doToggleTagFollowDesktop,
    doResolveUri,
    isAuthenticated,
    tileLayout,
    dynamicRouteProps,
  } = props;
  const buttonRef = useRef();
  const isHovering = useHover(buttonRef);
  const isMobile = useIsMobile();
  const { livestreamMap } = useGetLivestreams();

  const urlParams = new URLSearchParams(search);
  const claimType = urlParams.get('claim_type');
  const tagsQuery = urlParams.get('t') || null;
  const tags = tagsQuery ? tagsQuery.split(',') : null;
  const repostedClaimIsResolved = repostedUri && repostedClaim;

  // Eventually allow more than one tag on this page
  // Restricting to one to make follow/unfollow simpler
  const tag = (tags && tags[0]) || null;

  const isFollowing = followedTags.map(({ name }) => name).includes(tag);
  let label = isFollowing ? __('Following --[button label indicating a channel has been followed]--') : __('Follow');
  if (isHovering && isFollowing) {
    label = __('Unfollow');
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
        <Icon icon={(dynamicRouteProps && dynamicRouteProps.icon) || ICONS.WILD_WEST} size={10} />
        {(dynamicRouteProps && dynamicRouteProps.title) || __('Wild West')}
      </span>
    );
  }

  return (
    <Page noFooter fullWidthPage={tileLayout}>
      <ClaimListDiscover
        hideAdvancedFilter
        hideFilters={!dynamicRouteProps}
        header={repostedUri ? <span /> : undefined}
        tileLayout={repostedUri ? false : tileLayout}
        defaultOrderBy={dynamicRouteProps ? undefined : CS.ORDER_BY_TRENDING}
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
        releaseTime={!dynamicRouteProps && `>${Math.floor(moment().subtract(1, 'day').startOf('week').unix())}`}
        feeAmount={!dynamicRouteProps && CS.FEE_AMOUNT_ANY}
        channelIds={
          (dynamicRouteProps && dynamicRouteProps.options && dynamicRouteProps.options.channelIds) || undefined
        }
        limitClaimsPerChannel={
          (dynamicRouteProps && dynamicRouteProps.options && dynamicRouteProps.options.limitClaimsPerChannel) ||
          undefined
        }
        meta={
          !dynamicRouteProps ? (
            <a
              className="help"
              href="https://lbry.com/faq/trending"
              title={__('Learn more about LBRY Credits on %DOMAIN%', { DOMAIN })}
            >
              <I18nMessage
                tokens={{
                  lbc: <LbcSymbol />,
                }}
              >
                Results boosted by %lbc%
              </I18nMessage>
            </a>
          ) : (
            tag &&
            !isMobile && (
              <Button
                ref={buttonRef}
                button="alt"
                icon={ICONS.SUBSCRIBE}
                iconColor="red"
                onClick={handleFollowClick}
                requiresAuth={IS_WEB}
                label={label}
              />
            )
          )
        }
        liveLivestreamsFirst
        livestreamMap={livestreamMap}
        hasSource
      />
    </Page>
  );
}

export default DiscoverPage;
