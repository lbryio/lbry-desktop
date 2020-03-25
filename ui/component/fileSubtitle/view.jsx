// @flow
import React from 'react';
import DateTime from 'component/dateTime';
import FileViewCount from 'component/fileViewCount';
import CreditAmount from 'component/common/credit-amount';

type Props = {
  uri: string,
  claim: StreamClaim,
  pendingAmount: string,
};

function FileSubtitle(props: Props) {
  const { uri, claim, pendingAmount } = props;

  return (
    <div className="media__subtitle--between">
      <DateTime uri={uri} show={DateTime.SHOW_DATE} />
      <span>
        <CreditAmount
          badge={false}
          amount={parseFloat(claim.amount) + parseFloat(pendingAmount || claim.meta.support_amount)}
          precision={2}
        />
        {' • ' /* this is bad, but it's quick! */}
        <FileViewCount uri={uri} />
      </span>
    </div>
  );
}

export default FileSubtitle;
