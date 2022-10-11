// @flow
import * as MODALS from 'constants/modal_types';
import * as STRIPE from 'constants/stripe';
import React from 'react';
import FileActionButton from 'component/common/file-action-button';

type Props = {
  uri: string,
  fileAction?: boolean,
  // redux
  disableSupport: boolean,
  isRepost?: boolean,
  doOpenModal: (id: string, {}) => void,
  preferredCurrency: string,
  doTipAccountCheckForUri: (uri: string) => void,
  canReceiveFiatTips: ?boolean,
};

export default function ClaimSupportButton(props: Props) {
  const {
    uri,
    fileAction,
    isRepost,
    disableSupport,
    doOpenModal,
    preferredCurrency,
    canReceiveFiatTips,
    doTipAccountCheckForUri,
  } = props;

  React.useEffect(() => {
    if (canReceiveFiatTips === undefined) {
      doTipAccountCheckForUri(uri);
    }
  }, [canReceiveFiatTips, doTipAccountCheckForUri, uri]);

  if (disableSupport) return null;

  const iconSizes = { [STRIPE.CURRENCIES.EUR]: 16, [STRIPE.CURRENCIES.USD]: fileAction ? 22 : undefined };

  return (
    <FileActionButton
      className={canReceiveFiatTips ? 'approved-bank-account__button' : undefined}
      title={__('Support this content')}
      label={isRepost ? __('Support Repost') : __('Support --[button to support a claim]--')}
      icon={STRIPE.CURRENCY[preferredCurrency].icon}
      iconSize={iconSizes[preferredCurrency]}
      onClick={() => doOpenModal(MODALS.SEND_TIP, { uri, isSupport: true })}
      noStyle={!fileAction}
      requiresAuth
    />
  );
}
