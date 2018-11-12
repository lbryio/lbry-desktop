// @flow
import React from 'react';

type Props = {
  shapeShiftRate: ?number,
  originCoin: ?string,
  originCoinDepositFee: ?number,
  originCoinDepositMax: ?number,
  originCoinDepositMin: ?string,
};

export default (props: Props) => {
  const {
    shapeShiftRate,
    originCoin,
    originCoinDepositFee,
    originCoinDepositMax,
    originCoinDepositMin,
  } = props;

  return (
    <div>
      <span className="help">
        {__('Receive')} {shapeShiftRate} LBC
        {' / '}
        {'1'} {originCoin} {__('less')} {originCoinDepositFee} LBC {__('fee')}.
        <br />
        {__('Exchange max')}: {originCoinDepositMax} {originCoin}
        <br />
        {__('Exchange min')}: {originCoinDepositMin} {originCoin}
      </span>
    </div>
  );
};
