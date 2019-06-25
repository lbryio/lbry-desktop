// @flow
import React, { Fragment, PureComponent } from 'react';
import MarkdownPreview from 'component/common/markdown-preview';
import Button from 'component/button';
import Expandable from 'component/expandable';
import path from 'path';

type Props = {
  claim: StreamClaim,
  fileInfo: FileListItem,
  metadata: StreamMetadata,
  openFolder: string => void,
  contentType: string,
  user: ?any,
};

class FileDetails extends PureComponent<Props> {
  render() {
    const { claim, contentType, fileInfo, metadata, openFolder } = this.props;

    if (!claim || !metadata) {
      return (
        <div className="card__content">
          <span className="empty">{__('Empty claim or metadata info.')}</span>
        </div>
      );
    }

    const { description, languages, license } = metadata;

    const mediaType = contentType || 'unknown';
    let downloadPath = fileInfo && fileInfo.download_path ? path.normalize(fileInfo.download_path) : null;
    let downloadNote;
    // If the path is blank, file is not avialable. Create path from name so the folder opens on click.
    if (fileInfo && fileInfo.download_path === null) {
      downloadPath = `${fileInfo.download_directory}/${fileInfo.file_name}`;
      downloadNote = 'This file may have been moved or deleted';
    }

    return (
      <Fragment>
        <Expandable>
          {description && (
            <Fragment>
              <div className="media__info-title">About</div>
              <div className="media__info-text">
                <MarkdownPreview content={description} promptLinks />
              </div>
            </Fragment>
          )}
          <div className="media__info-title">Info</div>
          <div className="media__info-text">
            <div>
              {__('Content-Type')}
              {': '}
              {mediaType}
            </div>
            <div>
              {__('Languages')}
              {': '}
              {languages ? languages.join(' ') : null}
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
                <Button
                  button="link"
                  onClick={() => {
                    if (downloadPath) {
                      openFolder(downloadPath);
                    }
                  }}
                  label={downloadNote || downloadPath}
                />
              </div>
            )}
          </div>
        </Expandable>
      </Fragment>
    );
  }
}

export default FileDetails;
