// @flow
import { SIMPLE_SITE } from 'config';
import React, { PureComponent } from 'react';
import Button from 'component/button';
import path from 'path';
import { formatBytes } from 'util/format-bytes';

type Props = {
  claim: StreamClaim,
  fileInfo: FileListItem,
  metadata: StreamMetadata,
  openFolder: (string) => void,
  contentType: string,
  user: ?any,
};

class FileDetails extends PureComponent<Props> {
  render() {
    const { claim, contentType, fileInfo, metadata, openFolder } = this.props;

    if (!claim || !metadata) {
      return <span className="empty">{__('Empty claim or metadata info.')}</span>;
    }

    const { languages, license } = metadata;

    const mediaType = contentType || 'unknown';
    const fileSize =
      metadata.source && metadata.source.size
        ? formatBytes(metadata.source.size)
        : fileInfo && fileInfo.download_path && formatBytes(fileInfo.written_bytes);
    let downloadPath = fileInfo && fileInfo.download_path ? path.normalize(fileInfo.download_path) : null;
    let downloadNote;
    // If the path is blank, file is not available. Streamed files won't have any blobs saved
    // Create path from name so the folder opens on click.
    if (fileInfo && fileInfo.blobs_completed >= 1 && fileInfo.download_path === null) {
      downloadPath = `${fileInfo.download_directory}/${fileInfo.file_name}`;
      downloadNote = __('This file may have been streamed, moved or deleted');
    }

    return (
      <>
        <div className="media__details">
          <span>{__('LBRY URL')}</span>
          <span>{claim.canonical_url}</span>
        </div>
        <div className="media__details">
          <span>{__('Claim ID')}</span>
          <span>{claim.claim_id}</span>
        </div>

        {!SIMPLE_SITE && (
          <>
            {languages && (
              <div className="media__details">
                <span>{__('Languages')}</span>
                <span>{languages.join(' ')}</span>
              </div>
            )}

            {mediaType && (
              <div className="media__details">
                <span>{__('Media Type')}</span>
                <span>{mediaType}</span>
              </div>
            )}

            <div className="media__details">
              <span>{__('License')}</span>
              <span>{license}</span>
            </div>

            {downloadPath && (
              <div className="media__details">
                <span>{__('Downloaded to')}</span>
                <span>
                  <Button
                    button="link"
                    className="button--download-link"
                    onClick={() => {
                      if (downloadPath) {
                        openFolder(downloadPath);
                      }
                    }}
                    label={downloadNote || downloadPath.replace(/(.{10})/g, '$1\u200b')}
                  />
                </span>
              </div>
            )}
          </>
        )}

        {fileSize && (
          <div className="media__details">
            <span>{fileSize}</span>
          </div>
        )}
      </>
    );
  }
}

export default FileDetails;
