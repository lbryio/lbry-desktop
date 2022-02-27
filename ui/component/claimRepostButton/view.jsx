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
  doOpenModal: (string, {}) => void,
};

export default function ClaimRepostButton(props: Props) {
  const { uri, fileAction, doOpenModal } = props;

  console.log('uri', uri);

  return (
    <Tooltip title={__('Repost this claim')} arrow={false}>
      <Button
        button={!fileAction ? 'alt' : undefined}
        className={classnames({ 'button--file-action': fileAction })}
        icon={ICONS.REPOST}
        iconSize={fileAction ? 22 : undefined}
        label={__('Repost')}
        onClick={() => doOpenModal(MODALS.REPOST, { uri })}
      />
    </Tooltip>
  );
}
