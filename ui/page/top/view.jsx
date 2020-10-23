// @flow
import React from 'react';
import Page from 'component/page';
import ClaimListDiscover from 'component/claimListDiscover';
import ClaimEffectiveAmount from 'component/claimEffectiveAmount';
import { ORDER_BY_TOP, FRESH_ALL } from 'constants/claim_search';

type Props = {
  name: string,
};

function TopPage(props: Props) {
  const { name } = props;

  return (
    <Page>
      <ClaimListDiscover
        name={name}
        defaultFreshness={FRESH_ALL}
        defaultOrderBy={ORDER_BY_TOP}
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
