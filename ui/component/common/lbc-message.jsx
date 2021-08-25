// @flow
import React from 'react';
import I18nMessage from 'component/i18nMessage';
import CreditAmount from 'component/common/credit-amount';

type Props = {
  children: string,
};

export default function LbcMessage(props: Props) {
  let amount;
  const tokenizedMessage = props.children.replace(
    /(\d?\.?\d?-?\d?\.?-?\d+?)\s(LBC|LBRY Credits?)/g,
    (originalString, lbcAmount, thirdArg) => {
      amount = lbcAmount;
      return `%lbc%`;
    }
  );

  return (
    <I18nMessage tokens={{ lbc: amount ? <CreditAmount badge noFormat amount={amount} /> : undefined }}>
      {/* Catch any rogue LBC's left */}
      {tokenizedMessage.replace(/\sLBC/g, ' Credits')}
    </I18nMessage>
  );
}
