// @flow
import React, { Fragment } from 'react';
import ChannelForm from 'component/channelForm';
import * as PAGES from 'constants/pages';
import Page from 'component/page';
import Yrbl from 'component/yrbl';
import LbcSymbol from 'component/common/lbc-symbol';
import { useHistory } from 'react-router-dom';

type Props = {
  balance: number,
};

function ChannelCreatePage(props: Props) {
  const { balance } = props;

  function scrollToTop() {
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.scrollTop = 0; // It would be nice to animate this
    }
  }
  let history = useHistory();
  const returnToChannelList = _ => history.push(`/$/${PAGES.CHANNELS}`);
  return (
    <Page>
      {balance === 0 && (
        <Fragment>
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
        </Fragment>
      )}
      <ChannelForm scrollToTop={scrollToTop} disabled={balance === 0} onSuccess={returnToChannelList} />
    </Page>
  );
}

export default ChannelCreatePage;
