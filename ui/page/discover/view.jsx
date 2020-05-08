// @flow
import * as ICONS from 'constants/icons';
import React, { useRef } from 'react';
import Page from 'component/page';
import ClaimListDiscover from 'component/claimListDiscover';
import Button from 'component/button';
import useHover from 'effects/use-hover';
import analytics from 'analytics';
import HiddenNsfw from 'component/common/hidden-nsfw';
import Icon from 'component/common/icon';
import * as CS from 'constants/claim_search';
import Ads from 'lbrytv/component/ads';

type Props = {
  location: { search: string },
  followedTags: Array<Tag>,
  repostedUri: string,
  repostedClaim: ?GenericClaim,
  doToggleTagFollowDesktop: string => void,
  doResolveUri: string => void,
  isAuthenticated: boolean,
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
  } = props;
  const buttonRef = useRef();
  const isHovering = useHover(buttonRef);

  const urlParams = new URLSearchParams(search);
  const claimType = urlParams.get('claim_type');
  const tagsQuery = urlParams.get('t') || null;
  const tags = tagsQuery ? tagsQuery.split(',') : null;
  const repostedClaimIsResolved = repostedUri && repostedClaim;

  // Eventually allow more than one tag on this page
  // Restricting to one to make follow/unfollow simpler
  const tag = (tags && tags[0]) || null;

  const isFollowing = followedTags.map(({ name }) => name).includes(tag);
  let label = isFollowing ? __('Following') : __('Follow');
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
      </span>
    );
  } else {
    headerLabel = (
      <span>
        <Icon icon={ICONS.DISCOVER} size={10} />
        {__('All Content')}
      </span>
    );
  }

  return (
    <Page noFooter>
      <ClaimListDiscover
        claimType={claimType ? [claimType] : undefined}
        headerLabel={headerLabel}
        tags={tags}
        hiddenNsfwMessage={<HiddenNsfw type="page" />}
        repostedClaimId={repostedClaim ? repostedClaim.claim_id : null}
        injectedItem={!isAuthenticated && IS_WEB && <Ads type="video" />}
        meta={
          tag && (
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
        }
      />
    </Page>
  );
}

export default DiscoverPage;
