// @flow
import React from 'react';
import Page from 'component/page';
import Invited from './internal/invited';
import Spinner from 'component/spinner';

type Props = {
  uri: string,
  referrerUri: ?string,
  doResolveUri: (uri: string) => void,
};
export default function ReferredPage(props: Props) {
  const { uri, referrerUri, doResolveUri } = props;

  React.useEffect(() => {
    if (referrerUri === undefined) {
      doResolveUri(uri);
    }
  }, [doResolveUri, referrerUri, uri]);

  return (
    <Page authPage>
      {referrerUri === undefined ? (
        <div className="main--empty">
          <Spinner />
        </div>
      ) : (
        <Invited referrerUri={referrerUri} />
      )}
    </Page>
  );
}
