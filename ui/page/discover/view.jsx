// @flow
import * as ICONS from 'constants/icons';
import React from 'react';
import ClaimListDiscover from 'component/claimListDiscover';
import Page from 'component/page';
import Icon from 'component/common/icon';

function DiscoverPage() {
  return (
    <Page>
      <ClaimListDiscover
        headerLabel={
          <span>
            <Icon icon={ICONS.DISCOVER} size={10} />
            {__('All Content')}
          </span>
        }
      />
    </Page>
  );
}

export default DiscoverPage;
