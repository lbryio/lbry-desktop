// @flow
import React, { useEffect } from 'react';
import Button from 'component/button';
import ClaimList from 'component/claimList';
import Page from 'component/page';

type Props = {
  uris: Array<string>,
  checkPendingPublishes: () => void,
  fetching: boolean,
};

function FileListPublished(props: Props) {
  const { checkPendingPublishes, fetching, uris } = props;

  useEffect(() => {
    checkPendingPublishes();
  }, [checkPendingPublishes]);

  return (
    <Page notContained>
      {uris && uris.length ? (
        <div className="card">
          <ClaimList loading={fetching} persistedStorageKey="claim-list-published" uris={uris} />
        </div>
      ) : (
        <div className="main--empty">
          <section className="card card--section">
            <header className="card__header">
              <h2 className="card__title">{__("It looks like you haven't published anything to LBRY yet.")}</h2>
            </header>

            <div className="card__content">
              <div className="card__actions card__actions--center">
                <Button button="primary" navigate="/$/publish" label={__('Publish something new')} />
              </div>
            </div>
          </section>
        </div>
      )}
    </Page>
  );
}

export default FileListPublished;
