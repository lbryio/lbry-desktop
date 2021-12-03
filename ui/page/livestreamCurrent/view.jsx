// @flow
import React from 'react';
import LivestreamList from 'component/livestreamList';
import Button from 'component/button';
import Page from 'component/page';
import Yrbl from 'component/yrbl';

type Props = {
  user: ?User,
};

export default function LivestreamCurrentPage(props: Props) {
  const { user } = props;
  const canView = process.env.ENABLE_WIP_FEATURES || (user && user.global_mod);

  return (
    <Page>
      {canView ? (
        <LivestreamList />
      ) : (
        <Yrbl
          type="sad"
          title={__("This page isn't quite ready")}
          subtitle={__('Check back later.')}
          actions={
            <div className="section__actions">
              <Button button="primary" navigate="/" label={__('Go Home')} />
            </div>
          }
        />
      )}
    </Page>
  );
}
