// @flow

import React from 'react';
import CreditAmount from 'component/common/credit-amount';
import I18nMessage from 'component/i18nMessage';

type Props = {
  balance: number,
  inline?: boolean,
};

function WalletSpendableBalanceHelp(props: Props) {
  const { balance, inline } = props;

  if (!balance) {
    return null;
  }

  return inline ? (
    <span className="help--spendable">
      <I18nMessage tokens={{ balance: <CreditAmount amount={balance} precision={4} /> }}>
        %balance% available.
      </I18nMessage>
    </span>
  ) : (
    <div className="help">
      <I18nMessage tokens={{ balance: <CreditAmount amount={balance} precision={4} /> }}>
        Your immediately spendable balance is %balance%.
      </I18nMessage>
    </div>
  );
}

export default WalletSpendableBalanceHelp;
