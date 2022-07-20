// @flow
import * as ICONS from 'constants/icons';
import React from 'react';
import Button from 'component/button';
import { COL_TYPES } from 'constants/collections';

type Props = {
  uri: string,
  collectionId: string,
  focusable: boolean,
  // -- redux --
  doToast: (props: { message: string }) => void,
  doCollectionEdit: (id: string, CollectionEditParams) => void,
};

function ButtonAddToQueue(props: Props) {
  const { uri, collectionId, focusable = true, doToast, doCollectionEdit } = props;

  function handleRemove(e) {
    if (e) e.preventDefault();

    doToast({ message: __('Item removed') });

    doCollectionEdit(collectionId, { uris: [uri], remove: true, type: COL_TYPES.PLAYLIST });
  }

  return (
    <div className="claim-preview__hover-actions third-item">
      <Button
        title={__('Remove')}
        label={__('Remove')}
        className="button--file-action"
        icon={ICONS.DELETE}
        onClick={(e) => handleRemove(e)}
        tabIndex={focusable ? 0 : -1}
      />
    </div>
  );
}

export default ButtonAddToQueue;
