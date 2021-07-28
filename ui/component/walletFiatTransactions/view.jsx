// @flow
import * as ICONS from 'constants/icons';
import * as MODALS from 'constants/modal_types';
import * as PAGES from 'constants/pages';
import React from 'react';
import CreditAmount from 'component/common/credit-amount';
import Button from 'component/button';
import HelpLink from 'component/common/help-link';
import Card from 'component/common/card';
import Icon from 'component/common/icon';
import LbcSymbol from 'component/common/lbc-symbol';
import I18nMessage from 'component/i18nMessage';
import { formatNumberWithCommas } from 'util/number';
import { Lbryio } from 'lbryinc';

type Props = {
  balance: number,
  totalBalance: number,
  claimsBalance: number,
  supportsBalance: number,
  tipsBalance: number,
  doOpenModal: (string) => void,
  hasSynced: boolean,
  doFetchUtxoCounts: () => void,
  doUtxoConsolidate: () => void,
  fetchingUtxoCounts: boolean,
  consolidatingUtxos: boolean,
  consolidateIsPending: boolean,
  massClaimingTips: boolean,
  massClaimIsPending: boolean,
  utxoCounts: { [string]: number },
  accountDetails: any,
};

export const WALLET_CONSOLIDATE_UTXOS = 400;
const LARGE_WALLET_BALANCE = 100;

const WalletBalance = (props: Props) => {
  const {
    balance,
    claimsBalance,
    supportsBalance,
    tipsBalance,
    doOpenModal,
    hasSynced,
    doUtxoConsolidate,
    doFetchUtxoCounts,
    consolidatingUtxos,
    consolidateIsPending,
    massClaimingTips,
    massClaimIsPending,
    utxoCounts,
  } = props;
  const [detailsExpanded, setDetailsExpanded] = React.useState(false);
  const [accountStatusResponse, setAccountStatusResponse] = React.useState();


  const { other: otherCount = 0 } = utxoCounts || {};

  const totalBalance = balance + tipsBalance + supportsBalance + claimsBalance;
  const totalLocked = tipsBalance + claimsBalance + supportsBalance;
  const operationPending = massClaimIsPending || massClaimingTips || consolidateIsPending || consolidatingUtxos;

  React.useEffect(() => {
    if (balance > LARGE_WALLET_BALANCE && detailsExpanded) {
      doFetchUtxoCounts();
    }
  }, [doFetchUtxoCounts, balance, detailsExpanded]);

  var environment = 'test';

  function getAccountStatus(){
    return Lbryio.call(
      'account',
      'status',
      {
        environment
      },
      'post'
    );
  }

  React.useEffect(() => {
    (async function(){
      const response = await getAccountStatus();

      setAccountStatusResponse(response);

      console.log(response);
    })();
  }, []);

  return (
    <Card
      title={<><Icon size="18" icon={ICONS.FINANCE} />313 USD</>}
      subtitle={
        totalLocked > 0 ? (
          <I18nMessage>
            This is your remaining balance that can still be withdrawn to your bank account
          </I18nMessage>
        ) : (
          <span>{__('Your total balance.')}</span>
        )
      }
      body={
        <h1>Hello!</h1>
      }
      actions={
        <>
          {accountStatusResponse && accountStatusResponse.charges_enabled && <h2>Charges Enabled: True</h2>}
          {accountStatusResponse && <h2>Total Received Tips: ${accountStatusResponse.total_tipped / 100}</h2>}
          <p>Hello</p>
        </>
      }
    />
  );
};

export default WalletBalance;
