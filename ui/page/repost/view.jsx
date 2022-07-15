// @flow
import React from 'react';
import Page from 'component/page';
import { useHistory } from 'react-router';
import RepostCreate from 'component/repostCreate';
import YrblWalletEmpty from 'component/yrblWalletEmpty';
import useThrottle from 'effects/use-throttle';

export const REPOST_PARAMS = {
  FROM: 'from',
  TO: 'to',
  REDIRECT: 'redirect',
};

type Props = {
  // --redux--
  balance: number,
  resolveUri: (string) => void,
};

function RepostPage(props: Props) {
  const { balance, resolveUri } = props;

  const {
    location: { search },
  } = useHistory();

  const [contentUri, setContentUri] = React.useState('');
  const [repostUri, setRepostUri] = React.useState('');

  const urlParams = new URLSearchParams(search);
  const repostFrom = urlParams.get(REPOST_PARAMS.FROM);
  const redirectUri = urlParams.get(REPOST_PARAMS.REDIRECT);
  const repostTo = urlParams.get(REPOST_PARAMS.TO);

  const decodedFrom = repostFrom && decodeURIComponent(repostFrom);
  const throttledContentValue = useThrottle(contentUri, 500);
  const throttledRepostValue = useThrottle(repostUri, 500);

  React.useEffect(() => {
    if (throttledContentValue) {
      resolveUri(throttledContentValue);
    }
  }, [throttledContentValue, resolveUri]);

  React.useEffect(() => {
    if (throttledRepostValue) {
      resolveUri(throttledRepostValue);
    }
  }, [throttledRepostValue, resolveUri]);

  React.useEffect(() => {
    if (repostTo) {
      resolveUri(repostTo);
    }
  }, [repostTo, resolveUri]);

  return (
    <Page noFooter noSideNavigation backout={{ title: __('Repost'), backLabel: __('Back') }}>
      {balance === 0 && <YrblWalletEmpty />}
      <div className={balance === 0 ? 'card--disabled' : undefined}>
        <RepostCreate
          uri={decodedFrom}
          name={repostTo}
          redirectUri={redirectUri}
          repostUri={repostUri}
          contentUri={contentUri}
          setContentUri={setContentUri}
          setRepostUri={setRepostUri}
          isRepostPage
        />
      </div>
    </Page>
  );
}

export default RepostPage;
