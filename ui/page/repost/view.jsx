// @flow
import React from 'react';
import Page from 'component/page';
import { useHistory } from 'react-router';
import RepostCreate from 'component/repostCreate';
import YrblWalletEmpty from 'component/yrblWalletEmpty';
import useThrottle from 'effects/use-throttle';
import classnames from 'classnames';

type Props = {
  balance: number,
  resolveUri: string => void,
};
function RepostPage(props: Props) {
  const { balance, resolveUri } = props;

  const REPOST_FROM = 'from';
  const REPOST_TO = 'to';
  const REDIRECT = 'redirect';
  const {
    location: { search },
  } = useHistory();

  const urlParams = new URLSearchParams(search);
  const repostFrom = urlParams.get(REPOST_FROM);
  const redirectUri = urlParams.get(REDIRECT);
  const repostTo = urlParams.get(REPOST_TO);
  const [contentUri, setContentUri] = React.useState('');
  const [repostUri, setRepostUri] = React.useState('');
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
      <div className={classnames({ 'card--disabled': balance === 0 })}>
        <RepostCreate
          uri={decodedFrom}
          name={repostTo}
          redirectUri={redirectUri}
          repostUri={repostUri}
          contentUri={contentUri}
          setContentUri={setContentUri}
          setRepostUri={setRepostUri}
        />
      </div>
    </Page>
  );
}

export default RepostPage;
