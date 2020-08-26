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
                      <Button
                        button="secondary"
                        icon={ICONS.BUY}
                        label={__('Buy Credits')}
                        navigate={`/$/${PAGES.BUY}`}
                      />
                      <Button
                        icon={ICONS.RECEIVE}
                        button="secondary"
                        label={__('Your Address')}
                        onClick={() => doOpenModal(MODALS.WALLET_RECEIVE)}
                      />
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
