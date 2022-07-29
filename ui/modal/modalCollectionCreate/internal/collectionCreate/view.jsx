// @flow
import React from 'react';
import * as PAGES from 'constants/pages';
import Card from 'component/common/card';
import FormNewCollection from 'component/formNewCollection';

type Props = {
  sourceId?: string,
  closeModal: () => void,
  doToast: (params: { message: string }) => void,
};

const CollectionCreate = (props: Props) => {
  const { sourceId, closeModal, doToast } = props;

  function handleClose(newCollectionName: string, newCollectionId: string) {
    closeModal();

    let linkParams = {};
    if (sourceId && newCollectionId) {
      linkParams = { linkText: __('View Page'), linkTarget: `/${PAGES.PLAYLIST}/${newCollectionId}` };
    }

    doToast({
      message: __('Successfully created "%playlist_name%"', { playlist_name: newCollectionName }),
      ...linkParams,
    });
  }

  return (
    <Card
      singlePane
      title={sourceId ? __('Copy Playlist') : __('Create a Playlist')}
      subtitle={
        sourceId
          ? __('The copied playlist will be private and you will be able to edit its contents at any time.')
          : __('You will be able to add content to this playlist using the Save button while viewing content.')
      }
      actions={<FormNewCollection closeForm={handleClose} onlyCreate sourceId={sourceId} />}
    />
  );
};

export default CollectionCreate;
