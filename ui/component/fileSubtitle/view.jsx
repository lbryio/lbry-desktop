// @flow
import { SIMPLE_SITE } from 'config';
import React from 'react';
import DateTime from 'component/dateTime';
import FileViewCount from 'component/fileViewCount';
import CreditAmount from 'component/common/credit-amount';
import FileActions from 'component/fileActions';

type Props = {
  uri: string,
  claim: StreamClaim,
  pendingAmount: string,
};

function FileSubtitle(props: Props) {
  const { uri, claim, pendingAmount } = props;

  return (
    <div className="media__subtitle--between">
      <div className="file__viewdate">
        <span>
          <DateTime uri={uri} show={DateTime.SHOW_DATE} />
          {!SIMPLE_SITE && (
            <>
              {' • ' /* this is bad, but it's quick! */}
              <CreditAmount
                amount={parseFloat(claim.amount) + parseFloat(pendingAmount || claim.meta.support_amount)}
                precision={2}
              />
            </>
          )}
        </span>

        <FileViewCount uri={uri} />
      </div>

      <FileActions uri={uri} />
    </div>
  );
}

export default FileSubtitle;
