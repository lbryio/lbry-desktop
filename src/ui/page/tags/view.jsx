// @flow
import React, { useRef } from 'react';
import Page from 'component/page';
import ClaimListDiscover from 'component/claimListDiscover';
import Button from 'component/button';
import useHover from 'effects/use-hover';
import analytics from 'analytics';

type Props = {
  location: { search: string },
  followedTags: Array<Tag>,
  doToggleTagFollow: string => void,
};

function TagsPage(props: Props) {
  const {
    location: { search },
    followedTags,
    doToggleTagFollow,
  } = props;
  const buttonRef = useRef();
  const isHovering = useHover(buttonRef);

  const urlParams = new URLSearchParams(search);
  const tagsQuery = urlParams.get('t') || '';
  const tags = tagsQuery.split(',');
  // Eventually allow more than one tag on this page
  // Restricting to one to make follow/unfollow simpler
  const tag = tags[0];

  const isFollowing = followedTags.map(({ name }) => name).includes(tag);
  let label = isFollowing ? __('Following') : __('Follow');
  if (isHovering && isFollowing) {
    label = __('Unfollow');
  }

  function handleFollowClick() {
    doToggleTagFollow(tag);

    const nowFollowing = !isFollowing;
    analytics.tagFollowEvent(tag, nowFollowing, 'tag-page');
  }

  return (
    <Page>
      <ClaimListDiscover
        tags={tags}
        meta={<Button ref={buttonRef} button="link" onClick={handleFollowClick} label={label} />}
      />
    </Page>
  );
}

export default TagsPage;
