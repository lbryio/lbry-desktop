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
      return <span className="empty">{__('Empty claim or metadata info.')}</span>;
    }

    const { description, languages, license } = metadata;

    const mediaType = contentType || 'unknown';
    const fileSize = metadata.source.size
      ? formatBytes(metadata.source.size)
      : fileInfo && fileInfo.download_path && formatBytes(fileInfo.written_bytes);
    let downloadPath = fileInfo && fileInfo.download_path ? path.normalize(fileInfo.download_path) : null;
    let downloadNote;
    // If the path is blank, file is not avialable. Streamed files won't have any blobs saved
    // Create path from name so the folder opens on click.
    if (fileInfo && fileInfo.blobs_completed >= 1 && fileInfo.download_path === null) {
      downloadPath = `${fileInfo.download_directory}/${fileInfo.file_name}`;
      downloadNote = 'This file may have been streamed, moved or deleted';
    }

    return (
      <Fragment>
        <Expandable>
          {description && (
            <Fragment>
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
            {fileSize && (
              <div>
                {__('File Size')}
                {': '}
                {fileSize}
              </div>
            )}
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
                  className="button--download-link"
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
// move this with other helper functions when we re-use it
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export default FileDetails;
