// @flow
import * as ICONS from 'constants/icons';
import * as MODALS from 'constants/modal_types';
import * as React from 'react';
import Icon from 'component/common/icon';
import Button from 'component/button';

import { AppContext } from 'component/app/view';

type Props = {
  claimIsMine: boolean,
  isProtected: boolean,
  uri: string,
  userIsAMember: boolean,
  myMembership: ?Membership,
  cheapestPlanPrice: ?Membership,
  doOpenModal: (string, {}) => void,
};

const ProtectedContentOverlay = (props: Props) => {
  const { claimIsMine, uri, isProtected, myMembership, userIsAMember, cheapestPlanPrice, doOpenModal } = props;

  const fileUri = React.useContext(AppContext)?.uri;
  const membershipFetching = myMembership === undefined;

  if (membershipFetching || !isProtected || userIsAMember || claimIsMine) return null;

  return (
    <div className="protected-content-overlay">
      <Icon icon={ICONS.LOCK} />
      <span>{__('Only channel members can view this content.')}</span>
      <Button
        button="primary"
        icon={ICONS.MEMBERSHIP}
        label={
          cheapestPlanPrice
            ? __('Join for $%membership_price% per month', { membership_price: cheapestPlanPrice })
            : __('Membership options')
        }
        title={__('Become a member')}
        onClick={() => doOpenModal(MODALS.JOIN_MEMBERSHIP, { uri, fileUri })}
      />
    </div>
  );
};

export default ProtectedContentOverlay;
