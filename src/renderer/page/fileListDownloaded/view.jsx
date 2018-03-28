import React from 'react';
import Button from 'component/button';
import { FileTile } from 'component/fileTile';
import FileList from 'component/fileList';
import Page from 'component/page';

class FileListDownloaded extends React.PureComponent {
  render() {
    const { fileInfos, navigate } = this.props;
    const hasDownloads = fileInfos && fileInfos.length > 0;

    return (
      <Page notContained>
        {hasDownloads ? (
          <FileList fileInfos={fileInfos} />
        ) : (
          <div className="page__empty">
            {__("You haven't downloaded anything from LBRY yet.")}
            <div className="card__actions card__actions--center">
              <Button
                button="primary"
                onClick={() => navigate('/discover')}
                label={__('Explore new content')}
              />
            </div>
          </div>
        )}
      </Page>
    );
  }
}

export default FileListDownloaded;
