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
  doTipAccountStatus: () => Promise<StripeAccountStatus>,
  doGetAndSetAccountLink: () => Promise<StripeAccountLink>,
};

const ButtonStripeConnectAccount = (props: Props) => {
  const {
    // -- redux --
    chargesEnabled,
    accountRequiresVerification,
    accountLinkResponse,
    doTipAccountStatus,
    doGetAndSetAccountLink,
  } = props;

  const [fetching, setFetching] = React.useState(false);

  const bankAccountNotFetched = chargesEnabled === undefined;
  const stripeConnectionUrl = accountLinkResponse?.url;

  React.useEffect(() => {
    if (bankAccountNotFetched) {
      doTipAccountStatus();
    }
  }, [bankAccountNotFetched, doTipAccountStatus]);

  if (bankAccountNotFetched || fetching) {
    return (
      <Button
        disabled
        button="primary"
        label={
          <BusyIndicator
            message={fetching ? __('Confirming...') : __('Getting your bank account connection status...')}
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

  function confirmAddBankAccount() {
    setFetching(true);
    doGetAndSetAccountLink()
      .then(() => setFetching(false))
      .catch(() => setFetching(false));
  }

  return (
    <Button
      button="primary"
      label={__('Connect a bank account')}
      icon={ICONS.FINANCE}
      onClick={confirmAddBankAccount}
    />
  );
};

export default ButtonStripeConnectAccount;
