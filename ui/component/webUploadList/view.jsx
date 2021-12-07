// @flow
import * as React from 'react';
import Card from 'component/common/card';
import WebUploadItem from './internal/web-upload-item';

type Props = {
  currentUploads: { [key: string]: FileUploadItem },
  uploadCount: number,
  doPublishResume: (any) => void,
  doUpdateUploadRemove: (string, any) => void,
  doOpenModal: (string, {}) => void,
};

export default function WebUploadList(props: Props) {
  const { currentUploads, uploadCount, doPublishResume, doUpdateUploadRemove, doOpenModal } = props;

  return (
    !!uploadCount && (
      <Card
        title={__('Currently Uploading')}
        subtitle={__('Leave the app running until upload is complete')}
        body={
          <section>
            {/* $FlowFixMe */}
            {Object.values(currentUploads).map((uploadItem) => (
              <WebUploadItem
                // $FlowFixMe
                key={`upload${uploadItem.params.name}`}
                // $FlowFixMe
                uploadItem={uploadItem}
                doPublishResume={doPublishResume}
                doUpdateUploadRemove={doUpdateUploadRemove}
                doOpenModal={doOpenModal}
              />
            ))}
          </section>
        }
      />
    )
  );
}
