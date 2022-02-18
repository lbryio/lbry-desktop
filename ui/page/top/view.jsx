// @flow
import React from 'react';
import classnames from 'classnames';
import Page from 'component/page';
import ClaimListDiscover from 'component/claimListDiscover';
import ClaimEffectiveAmount from 'component/claimEffectiveAmount';
import SearchTopClaim from 'component/searchTopClaim';
import * as CS from 'constants/claim_search';
import Button from 'component/button';
import * as PAGES from 'constants/pages';
import { SIMPLE_SITE } from 'config';

type Props = {
  name: string,
  beginPublish: (string) => void,
};

function TopPage(props: Props) {
  const { name, beginPublish } = props;
  const [channelActive, setChannelActive] = React.useState(false);
  // if the query was actually '@name', still offer repost for 'name'
  const queryName = name[0] === '@' ? name.slice(1) : name;
  return (
    <Page className="topPage-wrapper">
      <SearchTopClaim query={name} hideLink setChannelActive={setChannelActive} />
      <ClaimListDiscover
        name={channelActive ? `@${queryName}` : queryName}
        defaultFreshness={CS.FRESH_ALL}
        defaultOrderBy={CS.ORDER_BY_TOP}
        streamType={SIMPLE_SITE ? CS.CONTENT_ALL : undefined}
        meta={
          <div className="search__top-links">
            <Button button="secondary" navigate={`/$/${PAGES.REPOST_NEW}?to=${queryName}`} label={__('Repost Here')} />
            <Button button="secondary" onClick={() => beginPublish(queryName)} label={__('Publish Here')} />
          </div>
        }
        includeSupportAction
        renderProperties={(claim) => (
          <span className="claim-preview__custom-properties">
            {claim.meta.is_controlling && <span className="help--inline">{__('Currently winning')}</span>}
            <ClaimEffectiveAmount uri={claim.repost_url || claim.canonical_url} />
          </span>
        )}
        header={
          <div className="claim-search__menu-group">
            <Button
              label={queryName}
              button="alt"
              onClick={() => setChannelActive(false)}
              className={classnames('button-toggle', {
                'button-toggle--active': !channelActive,
              })}
            />
            <Button
              label={`@${queryName}`}
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
