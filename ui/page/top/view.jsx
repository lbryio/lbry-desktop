// @flow
import React from 'react';
import Page from 'component/page';
import ClaimListDiscover from 'component/claimListDiscover';
import ClaimEffectiveAmount from 'component/claimEffectiveAmount';
import { TYPE_TOP, TIME_ALL } from 'component/claimListDiscover/view';

type Props = {
  name: string,
};

function TopPage(props: Props) {
  const { name } = props;

  return (
    <Page>
      <ClaimListDiscover
        name={name}
        defaultTypeSort={TYPE_TOP}
        defaultTimeSort={TIME_ALL}
        defaultOrderBy={['effective_amount']}
        includeSupportAction
        renderProperties={claim => (
          <span className="media__subtitle">
            <ClaimEffectiveAmount uri={claim.repost_url || claim.canonical_url} />
          </span>
        )}
        header={<span>{__('Top claims at lbry://%name%', { name })}</span>}
      />
    </Page>
  );
}

export default TopPage;
