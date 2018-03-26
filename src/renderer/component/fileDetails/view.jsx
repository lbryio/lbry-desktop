// @flow
import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import lbry from 'lbry';
import Button from 'component/button';
import path from 'path';

type Props = {
  claim: {},
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
      <div className="card__content">
        <span className="empty">{__('Empty claim or metadata info.')}</span>
      </div>
    );
  }

  const { description, language, license } = metadata;
  const mediaType = lbry.getMediaType(contentType);

  const downloadPath = fileInfo ? path.normalize(fileInfo.download_path) : null;

  return (
    <React.Fragment>
      {description && (
        <React.Fragment>
          <div className="card__subtext-title">About</div>
          <div className="card__subtext">
            <ReactMarkdown
              source={description || ''}
              escapeHtml
              disallowedTypes={['Heading', 'HtmlInline', 'HtmlBlock']}
            />
          </div>
        </React.Fragment>
      )}
      <div className="card__subtext-title">Info</div>
      <div className="card__subtext">
        <div>
          {__('Content-Type')}
          {': '}
          {mediaType}
        </div>
        <div>
          {__('Language')}
          {': '}
          {language}
        </div>
        <div>
          {__('License')}
          {': '}
          {license}
        </div>
        {downloadPath && (
          <div>
            {__('Downloaded to')}
            {': '}
            <Button button="link" onClick={() => openFolder(downloadPath)} label={downloadPath} />
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default FileDetails;
