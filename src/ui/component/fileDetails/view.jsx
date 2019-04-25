// @flow
import React, { Fragment, PureComponent } from 'react';
import { Lbryio } from 'lbryinc';
import MarkdownPreview from 'component/common/markdown-preview';
import Button from 'component/button';
import Expandable from 'component/expandable';
import path from 'path';
import FormField from '../common/form-components/form-field';

type Props = {
  claim: StreamClaim,
  fileInfo: FileListItem,
  metadata: StreamMetadata,
  openFolder: string => void,
  contentType: string,
  clickCommentButton: () => void,
  showSnackBar: React$Node => void,
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
    showSnackBar(
      <span>
        {__('Your Comment Has Been Posted')}
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

    const { description, languages, license } = metadata;

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
                  constrict
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
        <form className="form">
          <header className="card__header">
            <h2 className="card__header">Comments</h2>
          </header>
          <FormField
            name="comment"
            className="form-field--stretch"
            placeholder="Leave a Comment... "
          >
            <fieldset-section>
              <input
                className="form-field--SimpleMDE"
                placeholder="Leave a comment..."
                type="text"
                value=""
                id="comment-field"
              />
              <div className="card__actions--center">
                <Button
                  data-id="add-comment"
                  disabled={hasClickedComment}
                  button="primary"
                  label={__('Want to comment?')}
                  onClick={this.handleCommentClick}
                />
              </div>
              {hasClickedComment && (
                <p className="media__info-text media__info-text--center">
                  {user
                    ? __(
                      'Your support has been added. You will be notified when comments are available.'
                    )
                    : __('Your support has been added. Comments are coming soon.')}
                </p>
              )}
            </fieldset-section>
          </FormField>
        </form>
      </Fragment>
    );
  }
}

export default FileDetails;
