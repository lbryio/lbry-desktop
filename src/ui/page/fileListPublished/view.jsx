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
        <div className="main--empty">
          <section className="card card--section">
            <h2 className="card__title">{__("It looks like you haven't published anything to LBRY yet.")}</h2>

            <div className="card__actions card__actions--center">
              <Button button="primary" navigate="/$/publish" label={__('Publish something new')} />
            </div>
          </section>
        </div>
      )}
    </Page>
  );
}

export default FileListPublished;
