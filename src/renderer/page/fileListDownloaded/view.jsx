// @flow
import React from 'react';
import Button from 'component/button';
import FileList from 'component/fileList';
import Page from 'component/page';

type Props = {
  fetching: boolean,
  fileInfos: {},
  navigate: (string, ?{}) => void,
};

class FileListDownloaded extends React.PureComponent<Props> {
  render() {
    const { fetching, fileInfos, navigate } = this.props;
    const hasDownloads = fileInfos && Object.values(fileInfos).length > 0;

    return (
      <Page notContained loading={fetching}>
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
