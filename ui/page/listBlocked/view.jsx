// @flow
import React from 'react';
import ClaimList from 'component/claimList';
import Page from 'component/page';
import Card from 'component/common/card';

type Props = {
  uris: Array<string>,
};

function ListBlocked(props: Props) {
  const { uris } = props;

  return (
    <Page>
      {uris && uris.length ? (
        <Card
          isBodyList
          title={__('Your Blocked Channels')}
          body={<ClaimList uris={uris} showUnresolvedClaims showHiddenByUser />}
        />
      ) : (
        <div className="main--empty">
          <section className="card card--section">
            <h2 className="card__title card__title--deprecated">{__('You aren’t blocking any channels')}</h2>
            <p className="section__subtitle">
              {__('When you block a channel, all content from that channel will be hidden.')}
            </p>
          </section>
        </div>
      )}
    </Page>
  );
}

export default ListBlocked;
