// @flow
import 'scss/component/_superchat.scss';

import { formatCredits, formatFullPrice } from 'util/format-credits';
import classnames from 'classnames';
import LbcSymbol from 'component/common/lbc-symbol';
import React from 'react';

type Props = {
  amount?: number,
  className?: string,
  customAmounts?: { amountFiat: number, amountLBC: number },
  fee?: boolean,
  hideTitle?: boolean,
  isEstimate?: boolean,
  isFiat?: boolean,
  noFormat?: boolean,
  precision: number,
  showFree: boolean,
  showFullPrice: boolean,
  showLBC?: boolean,
  showPlus: boolean,
  size?: number,
  superChat?: boolean,
  superChatLight?: boolean,
};

class CreditAmount extends React.PureComponent<Props> {
  static defaultProps = {
    noFormat: false,
    precision: 2,
    showFree: false,
    showFullPrice: false,
    showLBC: true,
    showPlus: false,
  };

  render() {
    const {
      amount,
      className,
      customAmounts,
      fee,
      hideTitle,
      isEstimate,
      isFiat,
      noFormat,
      precision,
      showFree,
      showFullPrice,
      showLBC,
      showPlus,
      size,
      superChat,
      superChatLight,
    } = this.props;
    const minimumRenderableAmount = 10 ** (-1 * precision);

    // return null, otherwise it will try and convert undefined to a string
    if (amount === undefined && customAmounts === undefined) return null;

    function getAmountText(amount: number, isFiat?: boolean) {
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

      if (showFree && isFree) {
        return __('Free');
      } else {
        let amountText = noFormat ? amount : formattedAmount;

        if (showPlus && amount > 0) {
          amountText = `+${amountText}`;
        }

        if (showLBC && !isFiat) {
          amountText = <LbcSymbol postfix={amountText} size={size} />;
        } else if (showLBC && isFiat) {
          amountText = (
            <p style={{ display: 'inline' }}>
              ${isNaN(Number(amountText)) ? amountText : (Math.round(Number(amount) * 100) / 100).toFixed(2)}
            </p>
          );
        }

        if (fee) {
          amountText = __('%amount% fee', { amount: amountText });
        }

        return amountText;
      }
    }

    return (
      <span
        title={amount && !hideTitle ? formatFullPrice(amount, 2) : ''}
        className={classnames(className, { superChat: superChat, 'superChat--light': superChatLight })}
      >
        {customAmounts
          ? Object.values(customAmounts).map((amount, index) => (
              <span key={String(amount)} className="credit-amount">
                {getAmountText(Number(amount), !index)}
              </span>
            ))
          : amount && <span className="credit-amount">{getAmountText(amount, isFiat)}</span>}

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
