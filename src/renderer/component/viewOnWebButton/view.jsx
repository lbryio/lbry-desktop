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

  if (claimId && claimName) {
    const speechURL = claimName.startsWith('@')
      ? `${claimName}:${claimId}`
      : `${claimId}/${claimName}`;

    return (
      <Button
        icon={ICONS.GLOBE}
        button="alt"
        label={__('Share')}
        href={`https://spee.ch/${speechURL}`}
      />
    );
  }

  return null;
};
