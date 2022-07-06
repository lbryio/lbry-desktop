// @flow
import React from 'react';
import FileDownloadLink from 'component/fileDownloadLink';
import Card from 'component/common/card';

type Props = {
  uri: string,
  renderMode: string,
};

export default function FileRenderDownload(props: Props) {
  const { uri } = props;

  return <Card title={__('Download')} actions={<FileDownloadLink uri={uri} buttonType="primary" showLabel />} />;
}
