// @flow
import React from 'react';
import FileDownloadLink from 'component/fileDownloadLink';
import * as RENDER_MODES from 'constants/file_render_modes';
import Card from 'component/common/card';
import Button from 'component/button';

type Props = {
  uri: string,
  isFree: boolean,
  renderMode: string,
};

export default function FileRenderDownload(props: Props) {
  const { uri, renderMode, isFree } = props;

  // @if TARGET='web'
  if (RENDER_MODES.UNSUPPORTED_IN_THIS_APP.includes(renderMode)) {
    return (
      <Card
        title={isFree ? __('Download or Get the App') : __('Get the App')}
        subtitle={
          <p>
            {isFree
              ? __(
                  'This content can be downloaded from lbry.tv, but not displayed. It will display in LBRY Desktop, an app for desktop computers.'
                )
              : __('Paid content requires a full LBRY app.')}
          </p>
        }
        actions={
          <>
            {isFree && <FileDownloadLink uri={uri} buttonType="primary" showLabel />}
            <Button button={!isFree ? 'primary' : 'link'} label={__('Get the App')} href="https://lbry.com/get" />
          </>
        }
      />
    );
  }
  // @endif

  return <Card title={__('Download')} actions={<FileDownloadLink uri={uri} buttonType="primary" showLabel />} />;
}
