// @flow
import React from 'react';
import classnames from 'classnames';
import { formatCredits, formatFullPrice } from 'util/formatCredits';

type Props = {
  amount: number,
  precision: number,
  showFree: boolean,
  showFullPrice: boolean,
  showPlus: boolean,
  isEstimate?: boolean,
  large?: boolean,
};

class CreditAmount extends React.PureComponent<Props> {
  static defaultProps = {
    precision: 2,
    showFree: false,
    showFullPrice: false,
    showPlus: false,
  };

  render() {
    const { amount, precision, showFullPrice, showFree, showPlus, large, isEstimate } = this.props;

    const minimumRenderableAmount = 10 ** (-1 * precision);
    const fullPrice = formatFullPrice(amount, 2);
    const isFree = parseFloat(amount) === 0;

    let formattedAmount;
    if (showFullPrice) {
      formattedAmount = fullPrice;
    } else {
      formattedAmount =
        amount > 0 && amount < minimumRenderableAmount
          ? `<${minimumRenderableAmount}`
          : formatCredits(amount, precision);
    }

    let amountText;
    if (showFree && isFree) {
      amountText = __('FREE');
    } else {
      amountText = `${formattedAmount} ${__('LBC')}`;

      if (showPlus && amount > 0) {
        amountText = `+${amountText}`;
      }
    }

    return (
      <span
        title={fullPrice}
        className={classnames('credit-amount', {
          'credit-amount--free': !large && isFree,
          'credit-amount--cost': !large && !isFree,
          'credit-amount--large': large,
        })}
      >
        {amountText}

        {isEstimate ? (
          <span
            className="credit-amount__estimate"
            title={__('This is an estimate and does not include data fees')}
          >
            *
          </span>
        ) : null}
      </span>
    );
  }
}

export default CreditAmount;
