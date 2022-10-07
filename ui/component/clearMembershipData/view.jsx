// @flow
import React from 'react';

import * as ICONS from 'constants/icons';
import Button from 'component/button';

const isDev = process.env.NODE_ENV !== 'production';

type Props = {
  purchasedMemberships?: ?MembershipTiers,
  // -- redux --
  doMembershipClearData: () => void,
};

const ClearMembershipDataButton = (props: Props) => {
  const { purchasedMemberships, doMembershipClearData } = props;

  return (
    isDev &&
    (!purchasedMemberships || purchasedMemberships?.length > 0) && (
      <>
        <h1 style={{ marginTop: '30px', fontSize: '20px' }}>Clear Membership Data (Only Available On Dev)</h1>
        <div>
          <Button
            button="primary"
            label="Clear Membership Data"
            icon={ICONS.SETTINGS}
            className="membership_button"
            onClick={doMembershipClearData}
          />
        </div>
      </>
    )
  );
};

export default ClearMembershipDataButton;
