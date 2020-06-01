// @flow
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import * as MODALS from 'constants/modal_types';
import React from 'react';
import { withRouter } from 'react-router';
import WalletBalance from 'component/walletBalance';
import TxoList from 'component/txoList';
import Page from 'component/page';
import Yrbl from 'component/yrbl';
import Button from 'component/button';
import Spinner from 'component/spinner';

type Props = {
  history: { action: string, push: string => void, replace: string => void },
  location: { search: string, pathname: string },
  balance: number,
  doOpenModal: string => void,
};

const WalletPage = (props: Props) => {
  const { location, balance, doOpenModal } = props;
  const { search } = location;
  const showIntro = balance === 0;
  const loading = balance === undefined;

  return (
    <Page>
      {loading && (
        <div className="main--empty">
          <Spinner delayed />
        </div>
      )}
      {!loading && (
        <>
          {showIntro ? (
            <div className="main--empty">
              <Yrbl
                title={__('Your Wallet is Empty')}
                subtitle={
                  <div>
                    <p>
                      There are a lot of ways to get LBC! You can have your friend send you a few, earn rewards, or
                      purchase your own.
                    </p>
                    <div className="section__actions">
                      <Button button="primary" label={__('Earn Rewards')} navigate={`/$/${PAGES.REWARDS}`} />
                      <Button
                        button="secondary"
                        label={__('Send To Your Address')}
                        onClick={() => doOpenModal(MODALS.WALLET_RECEIVE)}
                      />
                      <Button button="alt" icon={ICONS.SEND} label={__('Buy Credits')} navigate={`/$/${PAGES.BUY}`} />
                    </div>
                  </div>
                }
              />
            </div>
          ) : (
            <>
              <WalletBalance />
              <TxoList search={search} />
            </>
          )}
        </>
      )}
    </Page>
  );
};

export default withRouter(WalletPage);
