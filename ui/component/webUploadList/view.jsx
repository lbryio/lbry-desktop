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
          subtitle={
            uploadCount > 1
              ? __('You files are currently uploading. This will update automatically.')
              : __('Your file is currently uploading. This will update automatically.')
          }
          body={
            <section>
              {/* $FlowFixMe */}
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
