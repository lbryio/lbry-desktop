// @flow
import React, { useEffect } from 'react';
import Button from 'component/button';
import ClaimList from 'component/claimList';
import Page from 'component/page';
import Paginate from 'component/common/paginate';
import { PAGE_PARAM, PAGE_SIZE_PARAM } from 'constants/claim';
import WebUploadList from 'component/webUploadList';
import Spinner from 'component/spinner';
import Card from 'component/common/card';
import * as ICONS from 'constants/icons';

type Props = {
  uploadCount: number,
  checkPendingPublishes: () => void,
  clearPublish: () => void,
  fetchClaimListMine: (number, number) => void,
  fetching: boolean,
  urls: Array<string>,
  urlTotal: number,
  history: { replace: string => void, push: string => void },
  page: number,
  pageSize: number,
};

function FileListPublished(props: Props) {
  const {
    uploadCount,
    checkPendingPublishes,
    clearPublish,
    fetchClaimListMine,
    fetching,
    urls,
    urlTotal,
    page,
    pageSize,
  } = props;

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
      fetchClaimListMine(params.page, params.page_size);
    }
  }, [uploadCount, paramsString, fetchClaimListMine]);

  return (
    <Page>
      <div className="card-stack">
        <WebUploadList />
        {!!(urls && urls.length) && (
          <Card
            title={__('Publishes')}
            titleActions={
              <div className="card__actions--inline">
                {fetching && <Spinner type="small" />}
                {!fetching && (
                  <Button
                    button="alt"
                    label={__('Refresh')}
                    icon={ICONS.REFRESH}
                    onClick={() => fetchClaimListMine(params.page, params.page_size)}
                  />
                )}
                <Button
                  icon={ICONS.PUBLISH}
                  button="secondary"
                  label={__('Publish')}
                  navigate="/$/publish"
                  onClick={() => clearPublish()}
                />
              </div>
            }
            isBodyList
            body={
              <div>
                <ClaimList isCardBody loading={fetching} persistedStorageKey="claim-list-published" uris={urls} />
                <Paginate totalPages={urlTotal > 0 ? Math.ceil(urlTotal / Number(pageSize)) : 1} />
              </div>
            }
          />
        )}
      </div>
      {!(urls && urls.length) && (
        <React.Fragment>
          {!fetching ? (
            <section className="main--empty">
              <div className=" section--small">
                <h2 className="section__title--large">{__('Nothing published to LBRY yet.')}</h2>
                <div className="section__actions">
                  <Button
                    button="primary"
                    navigate="/$/publish"
                    label={__('Publish something new')}
                    onClick={() => clearPublish()}
                  />
                </div>
              </div>
            </section>
          ) : (
            <section className="main--empty">
              <div className=" section--small">
                <h2 className="section__title--small">
                  {__('Checking your publishes')}
                  <Spinner type="small" />
                </h2>
              </div>
            </section>
          )}
        </React.Fragment>
      )}
    </Page>
  );
}

export default FileListPublished;
