// @flow
import React from 'react';

import * as ICONS from 'constants/icons';

import Button from 'component/button';
import BusyIndicator from 'component/common/busy-indicator';

type Props = {
  // -- redux --
  chargesEnabled: ?boolean,
  accountRequiresVerification: ?boolean,
  accountLinkResponse: StripeAccountLink,
  accountStatusFetching: boolean,
  doTipAccountStatus: () => Promise<StripeAccountStatus>,
  doGetAndSetAccountLink: () => Promise<StripeAccountLink>,
};

const ButtonStripeConnectAccount = (props: Props) => {
  const {
    // -- redux --
    chargesEnabled,
    accountRequiresVerification,
    accountLinkResponse,
    accountStatusFetching,
    doTipAccountStatus,
    doGetAndSetAccountLink,
  } = props;

  const [accountLinkFetching, setAccountLinkFetching] = React.useState(false);

  const bankAccountNotFetched = chargesEnabled === undefined;
  const stripeConnectionUrl = accountLinkResponse?.url;
  const accountStatusFailed = chargesEnabled === null;

  function confirmAddBankAccount() {
    setAccountLinkFetching(true);
    doGetAndSetAccountLink()
      .then(() => setAccountLinkFetching(false))
      .catch(() => setAccountLinkFetching(false));
  }

  React.useEffect(() => {
    if (bankAccountNotFetched) {
      doTipAccountStatus();
    }
  }, [bankAccountNotFetched, doTipAccountStatus]);

  if (bankAccountNotFetched || accountStatusFetching || accountLinkFetching) {
    return (
      <Button
        disabled
        button="primary"
        label={
          <BusyIndicator
            message={accountLinkFetching ? __('Confirming...') : __('Getting your bank account connection status...')}
          />
        }
        icon={ICONS.FINANCE}
      />
    );
  }

  if (accountRequiresVerification) {
    return (
      <Button
        button="primary"
        label={__('Complete Verification')}
        icon={ICONS.SETTINGS}
        navigate={stripeConnectionUrl}
        className="stripe__complete-verification-button"
      />
    );
  }

  if (stripeConnectionUrl) {
    return <Button button="link" label={__('Click here to connect a bank account')} navigate={stripeConnectionUrl} />;
  }

  return (
    <Button
      button="primary"
      label={accountStatusFailed ? __('Retry') : __('Connect a bank account')}
      icon={ICONS.FINANCE}
      onClick={accountStatusFailed ? doTipAccountStatus : confirmAddBankAccount}
    />
  );
};

export default ButtonStripeConnectAccount;
