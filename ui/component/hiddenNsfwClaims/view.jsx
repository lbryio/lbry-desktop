// @flow
import React from 'react';
import Button from 'component/button';

type Props = {
  numberOfNsfwClaims: number,
  obscureNsfw: boolean,
  className: ?string,
};

export default (props: Props) => {
  const { numberOfNsfwClaims, obscureNsfw } = props;

  return (
    obscureNsfw &&
    Boolean(numberOfNsfwClaims) && (
      <div className="section--padded section__subtitle">
        {numberOfNsfwClaims} {numberOfNsfwClaims > 1 ? __('files') : __('file')} {__('hidden due to your')}{' '}
        <Button button="link" navigate="/$/settings" label={__('content viewing preferences')} />.
      </div>
    )
  );
};
