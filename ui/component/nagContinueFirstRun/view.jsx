// @flow
import * as PAGES from 'constants/pages';
import React from 'react';
import Nag from 'component/common/nag';
import { useHistory } from 'react-router';

type Props = {
  followingAcknowledged: boolean,
  firstRunStarted: boolean,
  setClientSetting: (string, boolean) => void,
  syncSetttings: () => void,
};

export default function NagContinueFirstRun(props: Props) {
  const { firstRunStarted, followingAcknowledged } = props;
  const {
    location: { pathname },
    push,
  } = useHistory();
  const isOnFirstRun = pathname.includes(PAGES.AUTH);

  function handleContinue() {
    push(`/$/${PAGES.AUTH}`);
  }

  if (isOnFirstRun || !firstRunStarted || followingAcknowledged) {
    return null;
  }

  return (
    <Nag
      type="helpful"
      message={__('Continue setting up your account.')}
      actionText={__('Finish Up')}
      onClick={handleContinue}
    />
  );
}
