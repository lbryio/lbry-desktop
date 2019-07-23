// @flow
import React from 'react';
import Button from 'component/button';
import classnames from 'classnames';

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
      <div className={classnames('card--section', className || 'help')}>
        {numberOfNsfwClaims} {numberOfNsfwClaims > 1 ? __('files') : __('file')} {__('hidden due to your')}{' '}
        <Button button="link" navigate="/$/settings" label={__('content viewing preferences')} />.
      </div>
    )
  );
};
