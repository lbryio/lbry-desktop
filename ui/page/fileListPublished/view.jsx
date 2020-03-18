// @flow
import * as PAGES from 'constants/pages';
import React, { useEffect } from 'react';
import Button from 'component/button';
import ClaimList from 'component/claimList';
import Page from 'component/page';
import Paginate from 'component/common/paginate';
import { PAGE_SIZE } from 'constants/claim';
import WebUploadList from 'component/webUploadList';
import Spinner from 'component/spinner';

type Props = {
  checkPendingPublishes: () => void,
  clearPublish: () => void,
  fetchClaimListMine: () => void,
  fetching: boolean,
  urls: Array<string>,
  urlTotal: ?number,
  history: { replace: string => void },
  page: number,
};

function FileListPublished(props: Props) {
  const { checkPendingPublishes, clearPublish, fetchClaimListMine, fetching, urls, urlTotal } = props;
  useEffect(() => {
    checkPendingPublishes();
    fetchClaimListMine();
  }, [checkPendingPublishes, fetchClaimListMine]);

  return (
    <Page>
      <Button button="link" label={'Creator Dashboard'} navigate={`/$/${PAGES.CREATOR_DASHBOARD}`} />
      <WebUploadList />
      {urls && Boolean(urls.length) && (
        <React.Fragment>
          <ClaimList
            header={__('Your Publishes')}
            loading={fetching}
            persistedStorageKey="claim-list-published"
            uris={urls}
            headerAltControls={
              <Button button="link" label={__('New Publish')} navigate="/$/publish" onClick={() => clearPublish()} />
            }
          />
          <Paginate totalPages={Math.ceil(Number(urlTotal) / Number(PAGE_SIZE))} loading={fetching} />
        </React.Fragment>
      )}
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
