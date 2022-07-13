// @flow
import * as MODALS from 'constants/modal_types';
import * as ICONS from 'constants/icons';
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
};

export default function ClaimSupportButton(props: Props) {
  const { uri, fileAction, isRepost, disableSupport, doOpenModal, preferredCurrency } = props;

  if (disableSupport) return null;

  const currencyToUse = preferredCurrency;

  const iconToUse = {
    EUR: {
      icon: ICONS.EURO,
      iconSize: 16,
    },
    USD: {
      icon: ICONS.FINANCE,
      iconSize: fileAction ? 22 : undefined,
    },
  };

  return (
    <FileActionButton
      title={__('Support this content')}
      label={isRepost ? __('Support Repost') : __('Support --[button to support a claim]--')}
      icon={iconToUse[currencyToUse].icon}
      iconSize={iconToUse[currencyToUse].iconSize}
      onClick={() => doOpenModal(MODALS.SEND_TIP, { uri, isSupport: true })}
      noStyle={!fileAction}
    />
  );
}
