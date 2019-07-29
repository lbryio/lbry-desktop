// @flow
import React from 'react';
import Button from 'component/button';

type Props = {
  type?: string,
};

export default function UnsupportedOnWeb(props: Props) {
  const { type = 'page' } = props;

  return (
    IS_WEB && (
      <div className="card__subtitle--status">
        {type === 'page' && __('This page is not currently supported on the web')}
        {type === 'feature' && __('This feature is not currently supported on the web')}.{' '}
        <Button button="link" label={__('Download the desktop app')} href="https://lbry.com/get" /> for full feature
        support.
      </div>
    )
  );
}
