// @flow
import React from 'react';
import LivestreamForm from 'component/publish/livestream/livestreamForm';
import Page from 'component/page';
import YrblWalletEmpty from 'component/yrblWalletEmpty';
import Spinner from 'component/spinner';

type Props = {
  balance: number,
  fetchingChannels: boolean,
};

function LivestreamCreatePage(props: Props) {
  const { balance, fetchingChannels } = props;

  return (
    <Page className="uploadPage-wrapper" noFooter>
      {balance < 0.01 && <YrblWalletEmpty />}
      {balance >= 0.01 && fetchingChannels ? (
        <div className="main--empty">
          <Spinner />
        </div>
      ) : (
        <LivestreamForm disabled={balance < 0.01} />
      )}
    </Page>
  );
}

export default LivestreamCreatePage;
