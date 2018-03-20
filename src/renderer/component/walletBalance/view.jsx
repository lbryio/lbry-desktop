// @flow
import React from 'react';
import CreditAmount from 'component/common/credit-amount';

type Props = {
  balance: number,
};

const WalletBalance = (props: Props) => {
  const { balance } = props;
  return (
    <section className="card card--section card--wallet-balance">
      <div>
        <div className="card__title">{__('Balance')}</div>
        <span className="card__subtitle">{__('You currently have')}</span>
      </div>
      <div className="card__content">
        {(balance || balance === 0) && <CreditAmount large amount={balance} precision={8} />}
      </div>
    </section>
  );
};

export default WalletBalance;
