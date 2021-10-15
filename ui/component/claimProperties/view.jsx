// @flow
import * as ICONS from 'constants/icons';
import * as React from 'react';
import classnames from 'classnames';
import Icon from 'component/common/icon';
import FilePrice from 'component/filePrice';
import ClaimType from 'component/claimType';
import * as COL from 'constants/collections';

type Props = {
  uri: string,
  isSubscribed: boolean,
  small: boolean,
  claim: Claim | CollectionClaim,
  iconOnly: boolean,
};
export default function ClaimProperties(props: Props) {
  const { uri, isSubscribed, small = false, claim, iconOnly } = props;
  const isCollection = claim && claim.value_type === 'collection';
  const size = small ? COL.ICON_SIZE : undefined;
  // $FlowFixMe

  return (
    <div
      className={classnames('claim-preview__overlay-properties', { 'claim-preview__overlay-properties--small': small })}
    >
      {
        <>
          <ClaimType uri={uri} small />
          {/*   // $FlowFixMe */}
          {isCollection && claim && claim.value.claims && !iconOnly && <div>{claim.value.claims.length}</div>}
          {isSubscribed && <Icon size={size} tooltip icon={ICONS.SUBSCRIBE} />}
          <FilePrice hideFree uri={uri} />
        </>
      }
    </div>
  );
}
