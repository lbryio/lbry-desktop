// @flow
import * as PAGES from 'constants/pages';
import * as ICONS from 'constants/icons';
import React from 'react';
import ClaimListDiscover from 'component/claimListDiscover';
import Page from 'component/page';
import Button from 'component/button';
import Icon from 'component/common/icon';
import * as CS from 'constants/claim_search';

function DiscoverPage() {
  return (
    <Page noFooter>
      <ClaimListDiscover
        headerLabel={
          <span>
            <Icon icon={ICONS.TAG} size={10} />
            {__('Your Tags')}
          </span>
        }
        personalView
        defaultTags={CS.TAGS_FOLLOWED}
        meta={
          <Button
            button="alt"
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
