// @flow
import React, { useEffect } from 'react';
import Button from 'component/button';
import ClaimList from 'component/claimList';
import Page from 'component/page';
import Paginate from 'component/common/paginate';
import { PAGE_SIZE } from 'constants/claim';
import WebUploadList from 'component/webUploadList';
import Spinner from 'component/spinner';
import * as ICONS from 'constants/icons';

type Props = {
  checkPendingPublishes: () => void,
  fetchClaimListMine: () => void,
  fetching: boolean,
  urls: Array<string>,
  urlTotal: ?number,
  history: { replace: string => void },
  page: number,
};

function FileListPublished(props: Props) {
  const { checkPendingPublishes, fetchClaimListMine, fetching, urls, urlTotal } = props;
  useEffect(() => {
    checkPendingPublishes();
    fetchClaimListMine();
  }, [checkPendingPublishes, fetchClaimListMine]);

  return (
    <Page notContained>
      <WebUploadList />
      {urls && Boolean(urls.length) && (
        <div className="card">
          <ClaimList
            header={__('Your Publishes')}
            loading={fetching}
            persistedStorageKey="claim-list-published"
            uris={urls}
            headerAltControls={
              <Button button="link" label={__('New Publish')} navigate="/$/publish" icon={ICONS.NEW_PUBLISH} />
            }
          />
          <Paginate totalPages={Math.ceil(Number(urlTotal) / Number(PAGE_SIZE))} loading={fetching} />
        </div>
      )}
      {!(urls && urls.length) && (
        <React.Fragment>
          {!fetching ? (
            <section className="main--empty">
              <div className=" section--small">
                <h2 className="section__title--large">{__('Nothing published to LBRY yet.')}</h2>
                <div className="section__actions">
                  <Button button="primary" navigate="/$/publish" label={__('Publish something new')} />
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
