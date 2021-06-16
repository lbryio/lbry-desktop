// @flow
import * as MODALS from 'constants/modal_types';
import * as ICONS from 'constants/icons';
import React from 'react';
import Button from 'component/button';
import classnames from 'classnames';

type Props = {
  uri: string,
  doOpenModal: (string, {}) => void,
  fileAction?: boolean,
  type?: boolean,
  claim: Claim,
};

export default function CollectionAddButton(props: Props) {
  const { doOpenModal, uri, fileAction, type = 'playlist', claim } = props;

  // $FlowFixMe
  const streamType = (claim && claim.value && claim.value.stream_type) || '';
  const isPlayable = streamType === 'video' || streamType === 'audio';

  if (!isPlayable) return null;
  return (
    <Button
      button={fileAction ? undefined : 'alt'}
      className={classnames({ 'button--file-action': fileAction })}
      icon={fileAction ? ICONS.ADD : ICONS.LIBRARY}
      iconSize={fileAction ? 22 : undefined}
      label={uri ? __('Save') : 'New List'}
      requiresAuth={IS_WEB}
      title={__('Add this claim to a list')}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        doOpenModal(MODALS.COLLECTION_ADD, { uri, type });
      }}
    />
  );
}
