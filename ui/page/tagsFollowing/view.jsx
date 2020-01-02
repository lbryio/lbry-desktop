// @flow
import * as PAGES from 'constants/pages';
import * as ICONS from 'constants/icons';
import React from 'react';
import ClaimListDiscover from 'component/claimListDiscover';
import TagsSelect from 'component/tagsSelect';
import Page from 'component/page';
import Button from 'component/button';
import Icon from 'component/common/icon';

type Props = {
  followedTags: Array<Tag>,
  email: string,
};

function DiscoverPage(props: Props) {
  const { followedTags, email } = props;

  return (
    <Page>
      {(email || !IS_WEB) && <TagsSelect showClose title={__('Find New Tags To Follow')} />}
      <ClaimListDiscover
        headerLabel={
          <span>
            <Icon icon={ICONS.TAG} size={10} />
            {__('Your Tags')}
          </span>
        }
        hideCustomization={IS_WEB && !email}
        personalView
        tags={followedTags.map(tag => tag.name)}
        meta={
          <Button
            button="link"
            icon={ICONS.EDIT}
            label={__('Manage')}
            requiresAuth={IS_WEB}
            navigate={`/$/${PAGES.TAGS_FOLLOWING_MANAGE}`}
          />
        }
      />
    </Page>
  );
}

export default DiscoverPage;
