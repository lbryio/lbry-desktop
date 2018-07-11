// @flow
import React from 'react';

type Props = {
  numberOfNsfwClaims: number,
  obscureNsfw: boolean,
  className: ?string,
};

export default (props: Props) => {
  const { numberOfNsfwClaims, obscureNsfw, className } = props;
  return (
    obscureNsfw &&
    Boolean(numberOfNsfwClaims) && (
      <div className={className || 'help'}>
        {numberOfNsfwClaims} {numberOfNsfwClaims > 1 ? __('files') : __('file')}{' '}
        {__('hidden due to your content viewing preferences.')}
      </div>
    )
  );
};
