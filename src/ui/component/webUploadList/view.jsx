// @flow
import * as React from 'react';
import Card from 'component/common/card';
import WebUploadItem from './internal/web-upload-item';

export type UploadItem = {
  progess: string,
  params: UpdatePublishFormData,
  xhr?: { abort: () => void },
};

type Props = {
  currentUploads: { [key: string]: UploadItem },
  uploadCount: ?number,
};

export default function WebUploadList(props: Props) {
  const { currentUploads, uploadCount } = props;

  return (
    !!uploadCount && (
      <div>
        <Card
          title={__('Currently Uploading')}
          subtitle={<span>{__('You are currently uploading one or more files for publish.')}</span>}
          body={
            <section>
              {Object.values(currentUploads).map(({ progress, params, xhr }) => (
                <WebUploadItem key={`upload${params.name}`} progress={progress} params={params} xhr={xhr} />
              ))}
            </section>
          }
        />
      </div>
    )
  );
}
