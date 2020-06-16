// @flow
import React, { Fragment } from 'react';
import PublishForm from 'component/publishForm';
import Page from 'component/page';
import Yrbl from 'component/yrbl';
import LbcSymbol from 'component/common/lbc-symbol';
import RewardAuthIntro from 'component/rewardAuthIntro';
import usePersistedState from 'effects/use-persisted-state';

type Props = {
  balance: number,
  totalRewardValue: number,
};

function PublishPage(props: Props) {
  const { balance } = props;

  const [channel, setChannel] = usePersistedState('publish-channel', '');

  function scrollToTop() {
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.scrollTop = 0; // It would be nice to animate this
    }
  }

  function handleChannelChange(channel) {
    setChannel(channel);
  }

  return (
    <Page>
      {balance === 0 ? (
        <Fragment>
          <div className="section">
            <Yrbl
              title={__("You can't publish things quite yet")}
              subtitle={
                <Fragment>
                  <p>
                    {__(
                      'LBRY uses a blockchain, which is a fancy way of saying that users (you) are in control of your data.'
                    )}
                  </p>
                  <p>
                    {__('Because of the blockchain, some actions require LBRY credits')} (
                    <LbcSymbol />
                    ).
                  </p>
                  <p>
                    <LbcSymbol />{' '}
                    {__(
                      'allows you to do some neat things, like paying your favorite creators for their content. And no company can stop you.'
                    )}
                  </p>
                </Fragment>
              }
            />
          </div>
          <div className="section">
            <RewardAuthIntro />
          </div>
        </Fragment>
      ) : (
        <PublishForm
          scrollToTop={scrollToTop}
          disabled={balance === 0}
          channel={channel}
          onChannelChange={handleChannelChange}
        />
      )}
    </Page>
  );
}

export default PublishPage;
