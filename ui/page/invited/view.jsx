// @flow
import React from 'react';
import Page from 'component/page';
import Invited from 'component/invited';

type Props = {
  fullUri: string,
  referrer: string,
};
export default function ReferredPage(props: Props) {
  const { fullUri, referrer } = props;

  return (
    <Page authPage>
      <Invited fullUri={fullUri} referrer={referrer} />
    </Page>
  );
}
