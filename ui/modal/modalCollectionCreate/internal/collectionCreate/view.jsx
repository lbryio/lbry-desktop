// @flow
import React from 'react';
import Card from 'component/common/card';
import FormNewCollection from 'component/formNewCollection';

type Props = {
  closeModal: () => void,
  doToast: (params: { message: string }) => void,
};

const CollectionCreate = (props: Props) => {
  const { closeModal, doToast } = props;

  function handleClose(newCollectionName: string) {
    closeModal();
    doToast({ message: __('Succesfully created "%playlist_name%"', { playlist_name: newCollectionName }) });
  }

  return (
    <Card
      singlePane
      title={__('Create a Playlist')}
      subtitle={__('You will be able to add content to this playlist using the Save button while viewing content.')}
      actions={<FormNewCollection closeForm={handleClose} onlyCreate />}
    />
  );
};

export default CollectionCreate;
