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
          <ClaimList
            header={__('Your Publishes')}
            loading={fetching}
            persistedStorageKey="claim-list-published"
            uris={uris}
            defaultSort
            headerAltControls={<Button button="link" label={__('New Publish')} navigate="/$/publish" />}
          />
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
