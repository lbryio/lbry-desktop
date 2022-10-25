// @flow
import * as PAGES from 'constants/pages';
import React from 'react';
import ChannelForm from 'component/channelForm';
import Page from 'component/page';
import { useHistory } from 'react-router';
import YrblWalletEmpty from 'component/yrblWalletEmpty';

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
      {emptyBalance && <YrblWalletEmpty />}

      <ChannelForm
        disabled={emptyBalance}
        onDone={() => {
          push(redirectUrl || `/$/${PAGES.CHANNELS}`);
        }}
      />
    </Page>
  );
}

export default ChannelNew;
