// @flow
import React from 'react';
import CreditAmount from 'component/common/credit-amount';
import BalanceBackground from './balance-background.png';

type Props = {
  balance: number,
  totalBalance: number,
  claimsBalance: number,
  supportsBalance: number,
  tipsBalance: number,
};

const WalletBalance = (props: Props) => {
  const { balance, totalBalance, claimsBalance, supportsBalance, tipsBalance } = props;
  return (
    <section
      className="card card--section card--wallet-balance"
      style={{ backgroundImage: `url(${BalanceBackground})` }}
    >
      <h2 className="card__title">{__('Balance')}</h2>
      <span className="card__content--large">
        {(balance || balance === 0) && <CreditAmount badge={false} amount={balance} precision={8} />}
      </span>
      {tipsBalance > 0 && (
        <div className="card__content--small">
          Locked in Tips: <CreditAmount badge={false} amount={tipsBalance} precision={8} />
        </div>
      )}
      {claimsBalance > 0 && (
        <div className="card__content--small">
          Locked in claims: <CreditAmount badge={false} amount={claimsBalance} precision={8} />
        </div>
      )}
      {supportsBalance > 0 && (
        <div className="card__content--small">
          Locked in supports: <CreditAmount badge={false} amount={supportsBalance} precision={8} />
        </div>
      )}
      {totalBalance > 0 && (
        <div className="card__content--small">
          Total account value: <CreditAmount badge={false} amount={totalBalance} precision={8} />
        </div>
      )}
    </section>
  );
};

export default WalletBalance;
