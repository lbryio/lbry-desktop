// @flow
import * as ICONS from 'constants/icons';
import React from 'react';
import Button from 'component/button';

type Props = {
  claimId: ?string,
  claimName: ?string,
};

export default (props: Props) => {
  const { claimId, claimName } = props;
  const speechURL = claimName.startsWith('@')
    ? `${claimName}:${claimId}`
    : `${claimId}/${claimName}`;

  return claimId && claimName ? (
    <Button
      icon={ICONS.GLOBE}
      button="alt"
      label={__('Share')}
      href={`https://spee.ch/${speechURL}`}
    />
  ) : null;
};
