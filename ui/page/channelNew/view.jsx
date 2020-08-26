// @flow
import * as PAGES from 'constants/pages';
import * as ICONS from 'constants/icons';
import React from 'react';
import ChannelEdit from 'component/channelEdit';
import Page from 'component/page';
import Button from 'component/button';
import { useHistory } from 'react-router';
import Yrbl from 'component/yrbl';

type Props = {
  balance: number,
};

function ChannelNew(props: Props) {
  const { balance } = props;
  const { push, location } = useHistory();
  const urlSearchParams = new URLSearchParams(location.search);
  const redirectUrl = urlSearchParams.get('redirect');
  const emptyBalance = balance === 0;

  return (
    <Page noSideNavigation noFooter backout={{ title: __('Create a channel'), backLabel: __('Cancel') }}>
      {emptyBalance && (
        <div className="main--empty">
          <Yrbl
            type="sad"
            title={__('Your wallet is empty')}
            subtitle={
              <div>
                <p>{__('You need LBC to create a channel and upload content.')}</p>
                <p>
                  {__(
                    'Never fear though, there are tons of ways to earn LBC! You can earn or purchase LBC, or you can have your friends send you some.'
                  )}
                </p>
                <div className="section__actions">
                  <Button
                    button="primary"
                    icon={ICONS.REWARDS}
                    label={__('Earn Rewards')}
                    navigate={`/$/${PAGES.REWARDS}`}
                  />
                  <Button button="secondary" icon={ICONS.BUY} label={__('Buy Credits')} navigate={`/$/${PAGES.BUY}`} />
                </div>
              </div>
            }
          />
        </div>
      )}

      <ChannelEdit disabled={emptyBalance} onDone={() => push(redirectUrl || `/$/${PAGES.CHANNELS}`)} />
    </Page>
  );
}

export default ChannelNew;
