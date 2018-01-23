// @flow
import React from 'react';
import CreditAmount from 'component/common/credit-amount';

type Props = {
  balance: number,
};

const WalletBalance = (props: Props) => {
  const { balance } = props;
  return (
    <section className="card card--section">
      <h2>{__('Balance')}</h2>
      <span className="card__subtitle">{__('You currently have')}</span>
      <div className="card__content">
        {(balance || balance === 0) && <CreditAmount large amount={balance} precision={8} />}
      </div>
    </section>
  );
};

export default WalletBalance;
