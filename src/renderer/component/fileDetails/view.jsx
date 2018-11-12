// @flow
import * as React from 'react';
import MarkdownPreview from 'component/common/markdown-preview';
import Button from 'component/button';
import path from 'path';
import type { Claim } from 'types/claim';

type Props = {
  claim: Claim,
  fileInfo: {
    download_path: string,
  },
  metadata: {
    description: string,
    language: string,
    license: string,
  },
  openFolder: string => void,
  contentType: string,
};

const FileDetails = (props: Props) => {
  const { claim, contentType, fileInfo, metadata, openFolder } = props;

  if (!claim || !metadata) {
    return (
      <div className="media__content">
        <span className="empty">{__('Empty claim or metadata info.')}</span>
      </div>
    );
  }

  const { description, language, license } = metadata;

  const mediaType = contentType || 'unknown';
  const downloadPath = fileInfo ? path.normalize(fileInfo.download_path) : null;

  return (
    <React.Fragment>
      {description && (
        <React.Fragment>
          <div className="media__info__title">About</div>
          <div className="media__info__text">
            <MarkdownPreview content={description} promptLinks={true} />
          </div>
        </React.Fragment>
      )}

      <div className="media__info__title">Info</div>

      <ul className="media__info__text">
        <li>
          {__('Content-Type')}
          {': '}
          {mediaType}
        </li>

        <li>
          {__('Language')}
          {': '}
          {language}
        </li>

        <li>
          {__('License')}
          {': '}
          {license}
        </li>

        {downloadPath && (
          <li>
            {__('Downloaded to')}
            {': '}
            <Button button="link" onClick={() => openFolder(downloadPath)} label={downloadPath} />
          </li>
        )}
      </ul>
    </React.Fragment>
  );
};

export default FileDetails;
