// @flow
import React from 'react';
import Button from 'component/button';
import CardMedia from 'component/cardMedia';
type Props = {
  params: UpdatePublishFormData,
  progress: string,
  xhr?: () => void,
};

export default function WebUploadItem(props: Props) {
  const { params, progress, xhr } = props;

  return (
    <li className={'claim-preview'}>
      <CardMedia thumbnail={params.thumbnail_url} />
      <div className={'claim-preview-metadata'}>
        <div className="claim-preview-info">
          <div className="claim-preview-title">{params.title}</div>
          {xhr && (
            <div className="card__actions--inline">
              <Button
                button={'primary'}
                onClick={() => {
                  xhr.abort();
                }}
                label={'abort'}
              />
            </div>
          )}
        </div>
        <h2>{params.name}</h2>
        <div className={'claim-upload__progress--outer'}>
          <div className={'claim-upload__progress--inner'} style={{ width: `${progress}%` }}>
            Uploading...
          </div>
        </div>
      </div>
    </li>
  );
}
