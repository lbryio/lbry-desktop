// @flow
import React from 'react';
import classnames from 'classnames';
import Page from 'component/page';
import ClaimListDiscover from 'component/claimListDiscover';
import ClaimEffectiveAmount from 'component/claimEffectiveAmount';
import SearchTopClaim from 'component/searchTopClaim';
import { ORDER_BY_TOP, FRESH_ALL } from 'constants/claim_search';
import Button from 'component/button';
import I18nMessage from 'component/i18nMessage';
import * as PAGES from 'constants/pages';

type Props = {
  name: string,
  beginPublish: string => void,
};

function TopPage(props: Props) {
  const { name, beginPublish } = props;
  const [channelActive, setChannelActive] = React.useState(false);

  const queryName = name[0] === '@' ? name.slice(1) : name;
  return (
    <Page>
      <SearchTopClaim query={name} hideLink />
      <ClaimListDiscover
        name={channelActive ? `@${queryName}` : queryName}
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
          <div className="claim-search__menu-group--between">
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
            <div className="claim-list__header-action-text">
              <I18nMessage
                tokens={{
                  repost: (
                    <Button button="link" navigate={`/$/${PAGES.REPOST_NEW}?rto=${queryName}`} label={__('Repost')} />
                  ),
                  publish: <Button button="link" onClick={() => beginPublish(queryName)} label={'publish'} />,
                  name: <strong>{`${queryName}`}</strong>,
                }}
              >
                Take over! %repost% or %publish% what you want at %name%
              </I18nMessage>
            </div>
          </div>
        }
      />
    </Page>
  );
}

export default TopPage;
