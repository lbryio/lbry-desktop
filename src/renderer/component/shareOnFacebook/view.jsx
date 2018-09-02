// @flow
import React from 'react';
import * as icons from 'constants/icons';
import Button from 'component/button';
import Tooltip from 'component/common/tooltip';

type Props = {
  claimId: string,
  claimName: string,
};

export default (props: Props) => {
  const { claimId, claimName } = props;
  const speechURL = claimName.startsWith('@')
    ? `${claimName}:${claimId}`
    : `${claimId}/${claimName}`;

  return claimId && claimName ? (
    <Tooltip onComponent body={__('Post on Facebook')}>
      <Button
        icon={icons.FACEBOOK}
        button="alt"
        label={__('')}
        href={`https://facebook.com/sharer/sharer.php?u=http://spee.ch/${speechURL}`}
      />
    </Tooltip>
  ) : null;
};
