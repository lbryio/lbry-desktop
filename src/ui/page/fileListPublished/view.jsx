// @flow
import React, { useEffect } from 'react';
import Button from 'component/button';
import ClaimList from 'component/claimList';
import Page from 'component/page';
import Paginate from 'component/common/paginate';
import { PAGE_SIZE } from 'constants/claim';

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
      {urls && urls.length ? (
        <div className="card">
          <ClaimList
            header={__('Your Publishes')}
            loading={fetching}
            persistedStorageKey="claim-list-published"
            uris={urls}
            headerAltControls={<Button button="link" label={__('New Publish')} navigate="/$/publish" />}
          />
          <Paginate totalPages={Math.ceil(Number(urlTotal) / Number(PAGE_SIZE))} loading={fetching} />
        </div>
      ) : (
        <section className="main--empty">
          <div className=" section--small">
            <h2 className="section__title--large">{__('Nothing published to LBRY yet.')}</h2>

            <div className="section__actions">
              <Button button="primary" navigate="/$/publish" label={__('Publish something new')} />
            </div>
          </div>
        </section>
      )}
    </Page>
  );
}

export default FileListPublished;
