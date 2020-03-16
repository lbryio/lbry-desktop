// @flow
import * as PAGES from 'constants/pages';
import * as ICONS from 'constants/icons';
import React from 'react';
import ClaimListDiscover from 'component/claimListDiscover';
import TagsSelect from 'component/tagsSelect';
import Page from 'component/page';
import Button from 'component/button';
import Icon from 'component/common/icon';
import * as CS from 'constants/claim_search';

type Props = {
  email: string,
};

function DiscoverPage(props: Props) {
  const { email } = props;

  return (
    <Page>
      {(email || !IS_WEB) && <TagsSelect showClose limitShow={300} title={__('Find New Tags To Follow')} />}
      <ClaimListDiscover
        headerLabel={
          <span>
            <Icon icon={ICONS.TAG} size={10} />
            {__('Your Tags')}
          </span>
        }
        hideCustomization={IS_WEB && !email}
        personalView
        defaultTags={CS.TAGS_FOLLOWED}
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
