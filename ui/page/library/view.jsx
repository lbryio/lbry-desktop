// @flow
import React from 'react';
import Button from 'component/button';
import Page from 'component/page';
import Spinner from 'component/spinner';
import DownloadList from 'page/fileListDownloaded';
import Yrbl from 'component/yrbl';

type Props = {
  allDownloadedUrlsCount: number,
  myPurchases: Array<string>,
  fetchingMyPurchases: boolean,
  fetchingFileList: boolean,
};

function LibraryPage(props: Props) {
  const { allDownloadedUrlsCount, myPurchases, fetchingMyPurchases, fetchingFileList } = props;
  const hasDownloads = allDownloadedUrlsCount > 0 || (myPurchases && myPurchases.length);
  const loading = fetchingFileList || fetchingMyPurchases;

  return (
    <Page>
      {loading && !hasDownloads && (
        <div className="main--empty">
          <Spinner delayed />
        </div>
      )}

      {!loading && !hasDownloads && (
        <div className="main--empty">
          <Yrbl
            title={__("You haven't downloaded anything from LBRY yet")}
            subtitle={
              <div className="section__actions">
                <Button button="primary" navigate="/" label={__('Explore new content')} />
              </div>
            }
          />
        </div>
      )}

      {hasDownloads && <DownloadList />}
    </Page>
  );
}

export default LibraryPage;
