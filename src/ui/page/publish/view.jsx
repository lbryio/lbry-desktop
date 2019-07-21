// @flow
import React, { Fragment } from 'react';
import PublishForm from 'component/publishForm';
import Page from 'component/page';
import Yrbl from 'component/yrbl';
import LbcSymbol from 'component/common/lbc-symbol';
import CreditAmount from 'component/common/credit-amount';
import Button from 'component/button';

type Props = {
  balance: number,
  totalRewardValue: number,
};

function PublishPage(props: Props) {
  const { balance, totalRewardValue } = props;
  const totalRewardRounded = Math.floor(totalRewardValue / 10) * 10;

  function scrollToTop() {
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.scrollTop = 0; // It would be nice to animate this
    }
  }

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
          <section className="card card--section">
            <h1 className="card__title">{__('LBRY Credits Required')}</h1>
            <p className="card__subtitle">
              {__(' There are a variety of ways to get credits, including more than')}{' '}
              <CreditAmount inheritStyle amount={totalRewardRounded} />{' '}
              {__('in free rewards for participating in the LBRY beta.')}
            </p>
            <div className="card__actions">
              <Button button="link" navigate="/$/rewards" label={__('Checkout the rewards')} />
            </div>
          </section>
        </Fragment>
      )}
      <PublishForm scrollToTop={scrollToTop} />
    </Page>
  );
}

export default PublishPage;
