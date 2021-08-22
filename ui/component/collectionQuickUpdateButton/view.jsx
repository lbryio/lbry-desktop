// @flow
import * as ICONS from 'constants/icons';
import React from 'react';
import Button from 'component/button';

type Props = {
  collectionId: string,
  isEdit: boolean,
  doToast: ({ message: string }) => void,
  collectionPublishUpdate: (any) => Promise<any>,
  isUpdatingCollection: boolean,
};

function CollectionQuickUpdateButton(props: Props) {
  const { collectionId, isEdit, doToast, collectionPublishUpdate, isUpdatingCollection } = props;

  const options = { claim_id: collectionId };
  function handleQuickUpdate(e) {
    e.preventDefault();

    collectionPublishUpdate(options)
      .then(() => {
        doToast({
          message: __('Playlist updated'),
        });
      })
      .catch(() => {
        doToast({
          message: __('Something went wrong with your update'),
        });
      });
  }

  if (!isEdit) {
    return null;
  }
  return (
    <div className="claim-preview__collection-property-overlay">
      <Button
        requiresAuth={IS_WEB}
        className="button--file-action"
        icon={isUpdatingCollection ? ICONS.TIME : ICONS.PUBLISH}
        iconColor={'red'}
        disabled={isUpdatingCollection}
        onClick={(e) => handleQuickUpdate(e)}
        aria-label={__('Publish Update')}
      />
    </div>
  );
}

export default CollectionQuickUpdateButton;
