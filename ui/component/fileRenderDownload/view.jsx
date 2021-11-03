// @flow
import React from 'react';
import FileDownloadLink from 'component/fileDownloadLink';
import * as RENDER_MODES from 'constants/file_render_modes';
import Card from 'component/common/card';
import Button from 'component/button';

type Props = {
  uri: string,
  renderMode: string,
};

export default function FileRenderDownload(props: Props) {
  const { uri, renderMode } = props;

  // @if TARGET='web'
  if (RENDER_MODES.UNSUPPORTED_IN_THIS_APP.includes(renderMode)) {
    return (
      <Card
        title={__('Download or get the app')}
        subtitle={
          <p>
            {__(
              'This content can be downloaded from odysee.com, but not displayed. It will display in LBRY Desktop, an app for desktop computers.'
            )}
          </p>
        }
        actions={
          <div className="section__actions">
            <FileDownloadLink uri={uri} buttonType="primary" showLabel />
            <Button button={'link'} label={__('Get the App')} href="https://lbry.com/get" />
          </div>
        }
      />
    );
  }
  // @endif

  return <Card title={__('Download')} actions={<FileDownloadLink uri={uri} buttonType="primary" showLabel />} />;
}
