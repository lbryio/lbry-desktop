// @flow
import type { Claim, Metadata } from 'types/claim';
import type { FileInfo } from 'types/file_info';
import React, { Fragment, PureComponent } from 'react';
import { Lbryio } from 'lbryinc';
import MarkdownPreview from 'component/common/markdown-preview';
import Button from 'component/button';
import path from 'path';
import Expandable from 'component/expandable';

type Props = {
  claim: Claim,
  fileInfo: FileInfo,
  metadata: Metadata,
  openFolder: string => void,
  contentType: string,
  clickCommentButton: () => void,
  showSnackBar: string => void,
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
    showSnackBar(__('Thanks! This feature is so beta, all we had time for was this button.'));
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
    const downloadPath = fileInfo ? path.normalize(fileInfo.download_path) : null;

    return (
      <Fragment>
        <Expandable>
          {description && (
            <Fragment>
              <div className="card__subtext-title">About</div>
              <div className="card__subtext">
                <MarkdownPreview content={description} promptLinks />
              </div>
            </Fragment>
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
                <Button
                  button="link"
                  onClick={() => openFolder(downloadPath)}
                  label={downloadPath}
                />
              </div>
            )}
          </div>
        </Expandable>
        <div className="card__content">
          <div className="card__subtext-title">Comments</div>
          <div className="card__actions card__actions--center">
            <Button
              data-id="add-comment"
              disabled={hasClickedComment}
              button="primary"
              label="Comment"
              onClick={this.handleCommentClick}
            />
          </div>
          {hasClickedComment && (
            <p className="main--for-content">
              {user
                ? __(
                    'Your support has been added. You will be notified when comments are available.'
                  )
                : __('Your support has been added. Comments are coming soon.')}
            </p>
          )}
        </div>
      </Fragment>
    );
  }
}

export default FileDetails;
