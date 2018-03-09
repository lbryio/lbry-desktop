// @flow
import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import lbry from 'lbry';
import Button from 'component/link';
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
    <div>
      <div className="card__content">
        <div className="card__subtext-title">About</div>
        <div className="card__subtext">
          <ReactMarkdown
            source={description || ''}
            escapeHtml
            disallowedTypes={['Heading', 'HtmlInline', 'HtmlBlock']}
          />
        </div>
        <div className="card__subtext-title">Info</div>
        <div className="card__subtext">
          <dl>
            <dt>{__('Content-Type')}</dt>
            <dd>{mediaType}</dd>
            <dt>{__('Language')}</dt>
            <dd>{language}</dd>
            <dt>{__('License')}</dt>
            <dd>{license}</dd>
            {downloadPath && (
              <React.Fragment>
                <dt>{__('Downloaded to')}</dt>
                <dd>
                  <Button fakeLink onClick={() => openFolder(downloadPath)} label={downloadPath} />
                </dd>
              </React.Fragment>
            )}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default FileDetails;
