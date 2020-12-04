// @flow
import React from 'react';
import Page from 'component/page';
import { useHistory } from 'react-router';
import RepostCreate from 'component/repostCreate';
import YrblWalletEmpty from 'component/yrblWalletEmpty';
import useThrottle from 'effects/use-throttle';

type Props = {
  balance: number,
  resolveUri: string => void,
};
function RepostPage(props: Props) {
  const { balance, resolveUri } = props;

  const RFROM = 'rfrom';
  const RTO = 'rto';
  const REDIRECT = 'redirect';
  const {
    location: { search },
  } = useHistory();

  const urlParams = new URLSearchParams(search);
  const repostFrom = urlParams.get(RFROM);
  const redirectUri = urlParams.get(REDIRECT);
  const repostTo = urlParams.get(RTO);
  const [contentUri, setContentUri] = React.useState('');
  const [repostUri, setRepostUri] = React.useState('');
  const throttledContentValue = useThrottle(contentUri, 500);
  const throttledRepostValue = useThrottle(repostUri, 500);

  React.useEffect(() => {
    if (throttledContentValue && resolveUri) {
      resolveUri(throttledContentValue);
    }
  }, [throttledContentValue, resolveUri]);

  React.useEffect(() => {
    if (throttledRepostValue && resolveUri) {
      resolveUri(throttledRepostValue);
    }
  }, [throttledRepostValue, resolveUri]);

  React.useEffect(() => {
    if (repostTo && resolveUri) {
      resolveUri(repostTo);
    }
  }, [repostTo, resolveUri]);

  const decodedFrom = repostFrom && decodeURIComponent(repostFrom);
  return (
    <Page
      noFooter
      noSideNavigation
      backout={{
        title: __('Repost'),
        backLabel: __('Back'),
      }}
    >
      {balance === 0 && <YrblWalletEmpty />}
      <RepostCreate
        uri={decodedFrom}
        name={repostTo}
        redirectUri={redirectUri}
        repostUri={repostUri}
        contentUri={contentUri}
        setContentUri={setContentUri}
        setRepostUri={setRepostUri}
      />
    </Page>
  );
}

export default RepostPage;
