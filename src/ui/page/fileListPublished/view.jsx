// @flow
import React, { useEffect } from 'react';
import Button from 'component/button';
import FileList from 'component/fileList';
import Page from 'component/page';

type Props = {
  claims: Array<StreamClaim>,
  checkPendingPublishes: () => void,
  fetching: boolean,
};

function FileListPublished(props: Props) {
  const { checkPendingPublishes, fetching, claims } = props;

  useEffect(() => {
    checkPendingPublishes();
  }, [checkPendingPublishes]);

  return (
    <Page notContained loading={fetching}>
      {claims && claims.length ? (
        <div className="card">
          <FileList
            persistedStorageKey="file-list-published"
            // TODO: adjust selector to only return uris
            uris={claims.map(info => `lbry://${info.name}#${info.claim_id}`)}
          />
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
