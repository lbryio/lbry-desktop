// @flow
import React from 'react';
import classnames from 'classnames';
import Page from 'component/page';
import ClaimListDiscover from 'component/claimListDiscover';
import ClaimEffectiveAmount from 'component/claimEffectiveAmount';
import SearchTopClaim from 'component/searchTopClaim';
import { ORDER_BY_TOP, FRESH_ALL } from 'constants/claim_search';
import Button from 'component/button';

type Props = {
  name: string,
};

function TopPage(props: Props) {
  const { name } = props;
  const [channelActive, setChannelActive] = React.useState(false);

  return (
    <Page>
      <SearchTopClaim query={name} hideLink setChannelActive={setChannelActive} />
      <ClaimListDiscover
        name={channelActive ? `@${name}` : name}
        defaultFreshness={FRESH_ALL}
        defaultOrderBy={ORDER_BY_TOP}
        includeSupportAction
        renderProperties={claim => (
          <span className="claim-preview__custom-properties">
            {claim.meta.is_controlling && <span className="help--inline">{__('Currently winning')}</span>}
            <ClaimEffectiveAmount uri={claim.repost_url || claim.canonical_url} />
          </span>
        )}
        header={
          <div className="claim-search__menu-group">
            <Button
              label={name}
              button="alt"
              onClick={() => setChannelActive(false)}
              className={classnames('button-toggle', {
                'button-toggle--active': !channelActive,
              })}
            />
            <Button
              label={`@${name}`}
              button="alt"
              onClick={() => setChannelActive(true)}
              className={classnames('button-toggle', {
                'button-toggle--active': channelActive,
              })}
            />
          </div>
        }
      />
    </Page>
  );
}

export default TopPage;
