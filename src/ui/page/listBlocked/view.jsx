// @flow
import React from 'react';
import ClaimList from 'component/claimList';
import Page from 'component/page';

type Props = {
  uris: Array<string>,
};

function ListBlocked(props: Props) {
  const { uris } = props;

  return (
    <Page notContained>
      {uris && uris.length ? (
        <div className="card">
          <ClaimList
            header={<h1>{__('Your Blocked Channels')}</h1>}
            persistedStorageKey="block-list-published"
            uris={uris}
            defaultSort
            showHiddenByUser
          />
        </div>
      ) : (
        <div className="main--empty">
          <section className="card card--section">
            <header className="card__header">
              <h2 className="card__title">{__('It looks like you have no blocked channels.')}</h2>
            </header>
          </section>
        </div>
      )}
    </Page>
  );
}

export default ListBlocked;
