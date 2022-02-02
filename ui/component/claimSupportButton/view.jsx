// @flow
import * as MODALS from 'constants/modal_types';
import * as ICONS from 'constants/icons';
import React from 'react';
import classnames from 'classnames';
import Button from 'component/button';
import Tooltip from 'component/common/tooltip';

type Props = {
  uri: string,
  fileAction?: boolean,
  // redux
  disableSupport: boolean,
  isRepost?: boolean,
  doOpenModal: (id: string, {}) => void,
};

export default function ClaimSupportButton(props: Props) {
  const { uri, fileAction, isRepost, disableSupport, doOpenModal } = props;

  return disableSupport ? null : (
    <Tooltip title={__('Support this claim')} arrow={false}>
      <Button
        button={!fileAction ? 'alt' : undefined}
        className={classnames({ 'button--file-action': fileAction })}
        icon={ICONS.LBC}
        iconSize={fileAction ? 22 : undefined}
        label={isRepost ? __('Support Repost') : __('Support --[button to support a claim]--')}
        requiresAuth
        onClick={() => doOpenModal(MODALS.SEND_TIP, { uri, isSupport: true })}
      />
    </Tooltip>
  );
}
