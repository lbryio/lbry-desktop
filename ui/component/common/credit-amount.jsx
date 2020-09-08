// @flow
import React from 'react';
import classnames from 'classnames';
import LbcSymbol from 'component/common/lbc-symbol';
import { formatCredits, formatFullPrice } from 'lbry-redux';

type Props = {
  amount: number,
  precision: number,
  showFree: boolean,
  showFullPrice: boolean,
  showPlus: boolean,
  isEstimate?: boolean,
  showLBC?: boolean,
  fee?: boolean,
  className?: string,
};

class CreditAmount extends React.PureComponent<Props> {
  static defaultProps = {
    precision: 2,
    showFree: false,
    showFullPrice: false,
    showPlus: false,
    showLBC: true,
  };

  render() {
    const { amount, precision, showFullPrice, showFree, showPlus, isEstimate, fee, showLBC, className } = this.props;

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
          : formatCredits(amount, precision, true);
    }

    let amountText;
    if (showFree && isFree) {
      amountText = __('Free');
    } else {
      amountText = formattedAmount;

      if (showPlus && amount > 0) {
        amountText = `+${amountText}`;
      }

      if (showLBC) {
        amountText = <LbcSymbol prefix={amountText} />;
      }

      if (fee) {
        amountText = __('%amount% fee', { amount: amountText });
      }
    }

    return (
      <span title={fullPrice} className={classnames(className, {})}>
        <span className="credit-amount">{amountText}</span>

        {isEstimate ? (
          <span className="credit-amount__estimate" title={__('This is an estimate and does not include data fees')}>
            *
          </span>
        ) : null}
      </span>
    );
  }
}

export default CreditAmount;
