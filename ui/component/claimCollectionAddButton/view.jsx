// @flow
import * as MODALS from 'constants/modal_types';
import * as ICONS from 'constants/icons';
import React from 'react';
import Button from 'component/button';
import classnames from 'classnames';
import Tooltip from 'component/common/tooltip';

type Props = {
  uri: string,
  fileAction?: boolean,
  type?: boolean,
  // redux
  streamType: Claim,
  isSaved: boolean,
  doOpenModal: (id: string, {}) => void,
};

export default function CollectionAddButton(props: Props) {
  const { uri, fileAction, type = 'playlist', isSaved, streamType, doOpenModal } = props;

  const isPlayable = streamType === 'video' || streamType === 'audio';

  return !isPlayable ? null : (
    <Tooltip title={__('Add this claim to a list')} arrow={false}>
      <Button
        button={!fileAction ? 'alt' : undefined}
        className={classnames({ 'button--file-action': fileAction })}
        icon={fileAction ? (!isSaved ? ICONS.ADD : ICONS.STACK) : ICONS.LIBRARY}
        iconSize={fileAction ? 22 : undefined}
        label={uri ? (!isSaved ? __('Save') : __('Saved')) : __('New List')}
        requiresAuth
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          doOpenModal(MODALS.COLLECTION_ADD, { uri, type });
        }}
      />
    </Tooltip>
  );
}
