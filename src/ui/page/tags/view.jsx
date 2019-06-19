// @flow
import React from 'react';
import Page from 'component/page';
import ClaimListDiscover from 'component/claimListDiscover';
import Button from 'component/button';

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

  const urlParams = new URLSearchParams(search);
  const tagsQuery = urlParams.get('t') || '';
  const tags = tagsQuery.split(',');
  // Eventually allow more than one tag on this page
  // Restricting to one to make follow/unfollow simpler
  const tag = tags[0];

  const isFollowing = followedTags.map(({ name }) => name).includes(tag);

  return (
    <Page>
      <ClaimListDiscover
        tags={tags}
        meta={
          <Button
            button="alt"
            onClick={() => doToggleTagFollow(tag)}
            label={isFollowing ? __('Unfollow this tag') : __('Follow this tag')}
          />
        }
      />
    </Page>
  );
}

export default TagsPage;
