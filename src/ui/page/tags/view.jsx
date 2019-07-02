// @flow
import React, { createRef } from 'react';
import Page from 'component/page';
import ClaimListDiscover from 'component/claimListDiscover';
import Button from 'component/button';
import useHover from 'util/use-hover';

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
  const buttonRef = createRef();
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

  return (
    <Page>
      <ClaimListDiscover
        tags={tags}
        meta={<Button ref={buttonRef} button="link" onClick={() => doToggleTagFollow(tag)} label={label} />}
      />
    </Page>
  );
}

export default TagsPage;
