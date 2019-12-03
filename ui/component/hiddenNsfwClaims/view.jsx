// @flow
import React from 'react';
import Button from 'component/button';

type Props = {
  numberOfHiddenClaims: number,
  obscureNsfw: boolean,
  className: ?string,
};

export default (props: Props) => {
  const { numberOfHiddenClaims, obscureNsfw } = props;

  return (
    obscureNsfw &&
    Boolean(numberOfHiddenClaims) && (
      <div className="section--padded section__subtitle">
        {numberOfHiddenClaims} {numberOfHiddenClaims > 1 ? __('files') : __('file')} {__('hidden due to your')}{' '}
        <Button button="link" navigate="/$/settings" label={__('content viewing preferences')} />.
      </div>
    )
  );
};
