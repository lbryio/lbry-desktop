// @flow
import { SIMPLE_SITE } from 'config';
import * as ICONS from 'constants/icons';
import React from 'react';
import DateTime from 'component/dateTime';
import FileViewCount from 'component/fileViewCount';
import FileReactions from 'component/fileReactions';
import FileActions from 'component/fileActions';
import CreditAmount from 'component/common/credit-amount';
import Button from 'component/button';

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
      <div className="file__viewdate">
        <DateTime uri={uri} show={DateTime.SHOW_DATE} />
        <FileViewCount uri={uri} />
      </div>
      <div className="file__whoknows">
        <FileReactions uri={uri} />
        <FileActions uri={uri} />

        {!SIMPLE_SITE && (
          <>
            <CreditAmount
              amount={parseFloat(claim.amount) + parseFloat(pendingAmount || claim.meta.support_amount)}
              precision={2}
            />
            {' • ' /* this is bad, but it's quick! */}
          </>
        )}
        {claimId && !claimIsMine && !SIMPLE_SITE && (
          <Button
            iconSize={18}
            className="button--file-action"
            icon={ICONS.REPORT}
            description={__('Report content')}
            href={`https://lbry.com/dmca/${claimId}`}
          />
        )}
      </div>
    </div>
  );
}

export default FileSubtitle;
