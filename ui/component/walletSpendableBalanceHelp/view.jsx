// @flow
import CreditAmount from 'component/common/credit-amount';
import I18nMessage from 'component/i18nMessage';
import React from 'react';

type Props = { balance: number, inline?: boolean };

function WalletSpendableBalanceHelp(props: Props) {
  const { balance, inline } = props;

  const getMessage = (text: string) => (
    <I18nMessage tokens={{ balance: <CreditAmount amount={balance} precision={4} /> }}>{text}</I18nMessage>
  );

  return !balance ? null : inline ? (
    <span className="help--spendable">{getMessage('%balance% available.')}</span>
  ) : (
    <div className="help">{getMessage('Your immediately spendable balance is %balance%.')}</div>
  );
}

export default WalletSpendableBalanceHelp;
