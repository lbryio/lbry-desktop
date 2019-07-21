import React from 'react';
import Button from 'component/button';

export default function UnsupportedOnWeb() {
  return (
    IS_WEB && (
      <div className="help help--warning">
        This page is not currently supported on the web.{' '}
        <Button button="link" label={__('Download the desktop app')} href="https://lbry.com/get" /> for full feature
        support.
      </div>
    )
  );
}
