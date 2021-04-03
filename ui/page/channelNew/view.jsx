// @flow
import * as PAGES from 'constants/pages';
import React from 'react';
import ChannelEdit from 'component/channelEdit';
import Page from 'component/page';
import { useHistory } from 'react-router';
import YrblWalletEmpty from 'component/yrblWalletEmpty';

type Props = {
  balance: number,
  claimConfirmEmailReward: () => void,
  isAuthenticated: boolean,
};

function ChannelNew(props: Props) {
  const { balance, claimConfirmEmailReward, isAuthenticated } = props;
  const { push, location } = useHistory();
  const urlSearchParams = new URLSearchParams(location.search);
  const redirectUrl = urlSearchParams.get('redirect');
  const emptyBalance = balance === 0;

  React.useEffect(() => {
    if (isAuthenticated && emptyBalance) {
      claimConfirmEmailReward();
    }
  }, [isAuthenticated, claimConfirmEmailReward, emptyBalance]);

  return (
    <Page noSideNavigation noFooter backout={{ title: __('Create a channel'), backLabel: __('Cancel') }}>
      {emptyBalance && <YrblWalletEmpty />}

      <ChannelEdit
        disabled={emptyBalance}
        onDone={() => {
          push(redirectUrl || `/$/${PAGES.CHANNELS}`);
        }}
      />
    </Page>
  );
}

export default ChannelNew;
