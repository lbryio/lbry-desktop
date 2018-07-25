// @flow
import React from 'react';
import * as icons from 'constants/icons';
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
      icon={icons.GLOBE}
      button="alt"
      label={__('Share')}
      href={`http://spee.ch/${speechURL}`}
    />
  ) : null;
};
