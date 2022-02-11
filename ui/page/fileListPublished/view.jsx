// @flow
import * as PAGES from 'constants/pages';
import * as ICONS from 'constants/icons';
import React, { useEffect } from 'react';
import Button from 'component/button';
import ClaimList from 'component/claimList';
import Page from 'component/page';
import Paginate from 'component/common/paginate';
import { PAGE_PARAM, PAGE_SIZE_PARAM } from 'constants/claim';
import WebUploadList from 'component/webUploadList';
import Spinner from 'component/spinner';
import Yrbl from 'component/yrbl';
import classnames from 'classnames';
import useFetchViewCount from 'effects/use-fetch-view-count';

const FILTER_ALL = 'stream,repost';
const FILTER_UPLOADS = 'stream';
const FILTER_REPOSTS = 'repost';

type Props = {
  uploadCount: number,
  claimsByUri: { [string]: any },
  checkPendingPublishes: () => void,
  clearPublish: () => void,
  fetchClaimListMine: (number, number, boolean, Array<string>) => void,
  fetching: boolean,
  urls: Array<string>,
  urlTotal: number,
  history: { replace: (string) => void, push: (string) => void },
  page: number,
  pageSize: number,
  doFetchViewCount: (claimIdCsv: string) => void,
};

function FileListPublished(props: Props) {
  const {
    uploadCount,
    claimsByUri,
    checkPendingPublishes,
    clearPublish,
    fetchClaimListMine,
    fetching,
    urls,
    urlTotal,
    page,
    pageSize,
    doFetchViewCount,
  } = props;

  const [filterBy, setFilterBy] = React.useState(FILTER_ALL);
  const params = {};

  params[PAGE_PARAM] = Number(page);
  params[PAGE_SIZE_PARAM] = Number(pageSize);

  const paramsString = JSON.stringify(params);

  useEffect(() => {
    checkPendingPublishes();
  }, [checkPendingPublishes]);

  useEffect(() => {
    if (paramsString && fetchClaimListMine) {
      const params = JSON.parse(paramsString);
      fetchClaimListMine(params.page, params.page_size, true, filterBy.split(','));
    }
  }, [uploadCount, paramsString, filterBy, fetchClaimListMine]);

  useFetchViewCount(!fetching, urls, claimsByUri, doFetchViewCount);

  return (
    <Page>
      <div className="card-stack">
        <WebUploadList />
        {!!(urls && urls.length) && (
          <>
            <ClaimList
              header={
                <span>
                  <Button
                    button="alt"
                    label={__('All')}
                    aria-label={__('All uploads')}
                    onClick={() => setFilterBy(FILTER_ALL)}
                    className={classnames(`button-toggle`, {
                      'button-toggle--active': filterBy === FILTER_ALL,
                    })}
                  />
                  <Button
                    button="alt"
                    label={__('Uploads')}
                    onClick={() => setFilterBy(FILTER_UPLOADS)}
                    className={classnames(`button-toggle`, {
                      'button-toggle--active': filterBy === FILTER_UPLOADS,
                    })}
                  />
                  <Button
                    button="alt"
                    label={__('Reposts')}
                    onClick={() => setFilterBy(FILTER_REPOSTS)}
                    className={classnames(`button-toggle`, {
                      'button-toggle--active': filterBy === FILTER_REPOSTS,
                    })}
                  />
                </span>
              }
              headerAltControls={
                <div className="card__actions--inline">
                  {fetching && <Spinner type="small" />}
                  {!fetching && (
                    <Button
                      button="alt"
                      label={__('Refresh')}
                      icon={ICONS.REFRESH}
                      onClick={() => fetchClaimListMine(params.page, params.page_size, true, filterBy.split(','))}
                    />
                  )}
                  <Button
                    icon={ICONS.PUBLISH}
                    button="primary"
                    label={__('Upload')}
                    navigate={`/$/${PAGES.UPLOAD}`}
                    onClick={() => clearPublish()}
                  />
                </div>
              }
              persistedStorageKey="claim-list-published"
              uris={urls}
            />
            <Paginate totalPages={urlTotal > 0 ? Math.ceil(urlTotal / Number(pageSize)) : 1} />
          </>
        )}
      </div>
      {!(urls && urls.length) && (
        <React.Fragment>
          {!fetching ? (
            <section className="main--empty">
              <Yrbl
                title={__('No uploads')}
                subtitle={__("You haven't uploaded anything yet. This is where you can find them when you do!")}
                actions={
                  <div className="section__actions">
                    <Button
                      button="primary"
                      navigate={`/$/${PAGES.UPLOAD}`}
                      label={__('Upload Something New')}
                      onClick={() => clearPublish()}
                    />
                  </div>
                }
              />
            </section>
          ) : (
            <section className="main--empty">
              <Spinner delayed />
            </section>
          )}
        </React.Fragment>
      )}
    </Page>
  );
}

export default FileListPublished;
