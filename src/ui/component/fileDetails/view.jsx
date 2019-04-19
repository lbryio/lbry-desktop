// @flow
import type { Claim, Metadata } from 'types/claim';
import type { FileInfo } from 'types/file_info';
import type { Node } from 'react';
import React, { Fragment, PureComponent } from 'react';
import { Lbryio } from 'lbryinc';
import MarkdownPreview from 'component/common/markdown-preview';
import Button from 'component/button';
import Expandable from 'component/expandable';
import path from 'path';

type Props = {
  claim: Claim,
  fileInfo: FileInfo,
  metadata: Metadata,
  openFolder: string => void,
  contentType: string,
  clickCommentButton: () => void,
  showSnackBar: Node => void,
  hasClickedComment: boolean,
  user: ?any,
};

class FileDetails extends PureComponent<Props> {
  constructor() {
    super();
    (this: any).handleCommentClick = this.handleCommentClick.bind(this);
  }

  handleCommentClick() {
    const { clickCommentButton, showSnackBar } = this.props;

    clickCommentButton();
    Lbryio.call('user_tag', 'edit', { add: 'comments-waitlist' });
    showSnackBar(
      <span>
        {__('Thanks! Comments are coming soon')}
        <sup>TM</sup>
      </span>
    );
  }

  render() {
    const {
      claim,
      contentType,
      fileInfo,
      metadata,
      openFolder,
      hasClickedComment,
      user,
    } = this.props;

    if (!claim || !metadata) {
      return (
        <div className="card__content">
          <span className="empty">{__('Empty claim or metadata info.')}</span>
        </div>
      );
    }

    const { description, language, license } = metadata;

    const mediaType = contentType || 'unknown';
    let downloadPath =
      fileInfo && fileInfo.download_path ? path.normalize(fileInfo.download_path) : null;
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
                <Button
                  constrict
                  button="link"
                  onClick={() => openFolder(downloadPath)}
                  label={downloadNote || downloadPath}
                />
              </div>
            )}
          </div>
        </Expandable>

        <div className="media__info-title">Comments</div>

        <div className="card__actions--center">
          <Button
            data-id="add-comment"
            disabled={hasClickedComment}
            button="primary"
            label={__('Want to comment?')}
            onClick={this.handleCommentClick}
          />
        </div>
        <br />
        {hasClickedComment && (
          <p className="media__info-text media__info-text--center">
            {user
              ? __('Your support has been added. You will be notified when comments are available.')
              : __('Your support has been added. Comments are coming soon.')}
          </p>
        )}
      </Fragment>
    );
  }
}

export default FileDetails;
