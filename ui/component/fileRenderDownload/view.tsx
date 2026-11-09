import React from 'react';
import FileDownloadLink from 'component/fileDownloadLink';
import Card from 'component/common/card';

type Props = {
  uri: string,
  renderMode: string
};

export default function FileRenderDownload(props: Props) {
  const { uri } = props;

// @ts-expect-error - TS2322 - Type 'Element' is not assignable to type 'string | Node'.
  return <Card title={__('Download')} actions={<FileDownloadLink uri={uri} buttonType="primary" showLabel />} />;
}
