// @flow
import React from 'react';
import Button from 'component/button';
import FileList from 'component/fileList';
import Page from 'component/page';
import { PAGES } from 'lbry-redux';

type Props = {
  fetching: boolean,
  fileInfos: {},
  sortBy: string,
};

class FileListDownloaded extends React.PureComponent<Props> {
  render() {
    const { fetching, fileInfos, sortBy } = this.props;
    const hasDownloads = fileInfos && Object.values(fileInfos).length > 0;

    return (
      <Page notContained loading={fetching}>
        {hasDownloads ? (
          <FileList fileInfos={fileInfos} sortBy={sortBy} page={PAGES.DOWNLOADED} />
        ) : (
          <div className="page__empty">
            <section className="card card--section">
              <header className="card__header">
                <h2 className="card__title">
                  {__("You haven't downloaded anything from LBRY yet.")}
                </h2>
              </header>

              <div className="card__content">
                <div className="card__actions card__actions--center">
                  <Button button="primary" navigate="/" label={__('Explore new content')} />
                </div>
              </div>
            </section>
          </div>
        )}
      </Page>
    );
  }
}

export default FileListDownloaded;
