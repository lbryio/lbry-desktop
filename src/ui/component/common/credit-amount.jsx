// @flow
import React from 'react';
import classnames from 'classnames';
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
  badge?: boolean,
};

class CreditAmount extends React.PureComponent<Props> {
  static defaultProps = {
    precision: 2,
    showFree: false,
    showFullPrice: false,
    showPlus: false,
    showLBC: true,
    badge: true,
  };

  render() {
    const { amount, precision, showFullPrice, showFree, showPlus, isEstimate, fee, showLBC, badge } = this.props;

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
        amountText = `${amountText} ${__('LBC')}`;
      }

      if (fee) {
        amountText = `${amountText} ${__('fee')}`;
      }
    }

    return (
      <span
        title={fullPrice}
        className={classnames({
          badge,
          'badge--cost': badge && amount > 0,
          'badge--free': badge && isFree,
        })}
      >
        {amountText}

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
