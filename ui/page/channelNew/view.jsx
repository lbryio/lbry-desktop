// @flow
import React from 'react';
import ChannelEdit from 'component/channelEdit';
import Page from 'component/page';
import Button from 'component/button';
import { useHistory } from 'react-router';
import * as PAGES from 'constants/pages';

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
    <Page noSideNavigation noFooter backout={{ title: __('Create A Channel'), backLabel: __('Cancel') }}>
      {emptyBalance && (
        <div className="main--contained">
          <div className="notice-message--above-content">
            <h1 className="section__title">You need LBC for this</h1>
            <h1 className="section__subtitle">Get sum coinz</h1>
            <div className="section__actions">
              <Button button="primary" label={__('Earn Rewards')} navigate={`/$/${PAGES.REWARDS}`} />
              <Button button="primary" label={__('Purchase LBC')} navigate={`/$/${PAGES.BUY}`} />
            </div>
          </div>
        </div>
      )}

      <ChannelEdit disabled={emptyBalance} onDone={() => push(redirectUrl || `/$/${PAGES.CHANNELS}`)} />
    </Page>
  );
}

export default ChannelNew;
