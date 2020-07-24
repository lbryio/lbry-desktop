// @flow
import { SIMPLE_SITE } from 'config';
import * as ICONS from 'constants/icons';
import React from 'react';
import DateTime from 'component/dateTime';
import FileViewCount from 'component/fileViewCount';
import CreditAmount from 'component/common/credit-amount';
import HelpLink from 'component/common/help-link';

type Props = {
  uri: string,
  claim: StreamClaim,
  pendingAmount: string,
  claimIsMine: boolean,
};

function FileSubtitle(props: Props) {
  const { uri, claim, pendingAmount, claimIsMine } = props;
  const claimId = claim && claim.claim_id;

  return (
    <div className="media__subtitle--between">
      <DateTime uri={uri} show={DateTime.SHOW_DATE} />
      <span>
        {!SIMPLE_SITE && (
          <>
            <CreditAmount
              badge={false}
              amount={parseFloat(claim.amount) + parseFloat(pendingAmount || claim.meta.support_amount)}
              precision={2}
            />
            {' • ' /* this is bad, but it's quick! */}
          </>
        )}
        <FileViewCount uri={uri} />
        {claimId && !claimIsMine && SIMPLE_SITE && (
          <HelpLink description={__('Report content')} icon={ICONS.REPORT} href={`https://lbry.com/dmca/${claimId}`} />
        )}
      </span>
    </div>
  );
}

export default FileSubtitle;
