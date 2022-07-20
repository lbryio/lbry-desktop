// @flow
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Modal } from 'modal/modal';
import Button from 'component/button';
import Card from 'component/common/card';
import I18nMessage from 'component/i18nMessage';
import { FormField } from 'component/common/form';
import { COL_TYPES } from 'constants/collections';

type Props = {
  claim: Claim,
  collectionId: string,
  collectionName: string,
  uri: ?string,
  redirect: ?string,
  collectionParams: CollectionPublishParams,
  collectionUrls: Array<string>,
  doHideModal: () => void,
  doCollectionDelete: (string, ?string) => void,
  doLocalCollectionCreate: (params: CollectionCreateParams) => void,
};

function ModalRemoveCollection(props: Props) {
  const {
    claim,
    collectionId,
    collectionName,
    uri,
    redirect,
    collectionParams,
    collectionUrls,
    doHideModal,
    doCollectionDelete,
    doLocalCollectionCreate,
  } = props;

  const { replace } = useHistory();

  const [confirmName, setConfirmName] = useState('');
  const [keepPrivate, setKeepPrivate] = useState('');

  const title = claim && claim.value && claim.value.title;

  return (
    <Modal isOpen contentLabel={__('Confirm Playlist Unpublish')} type="card" onAborted={doHideModal}>
      <Card
        title={__('Delete Playlist')}
        body={
          uri ? (
            <React.Fragment>
              <p>{__('This will permanently delete the list.')}</p>
              <p>{__('Type "%list_name%" to confirm.', { list_name: collectionName })}</p>
              <FormField value={confirmName} type={'text'} onChange={(e) => setConfirmName(e.target.value)} />
              <FormField
                name="keep-private"
                type="checkbox"
                label={__('Delete publish but keep private playlist')}
                checked={keepPrivate}
                onChange={() => setKeepPrivate(!keepPrivate)}
              />
            </React.Fragment>
          ) : (
            <I18nMessage tokens={{ title: <cite>{uri && title ? `"${title}"` : `"${collectionName}"`}</cite> }}>
              Are you sure you'd like to remove %title%?
            </I18nMessage>
          )
        }
        actions={
          <>
            <div className="section__actions">
              <Button
                button="primary"
                label={__('Delete')}
                disabled={uri && collectionName !== confirmName}
                onClick={() => {
                  if (redirect) replace(redirect);
                  doCollectionDelete(collectionId, uri ? (keepPrivate ? 'resolved' : 'all') : undefined);
                  if (uri && keepPrivate) {
                    const { name, description, thumbnail_url } = collectionParams;
                    const createParams = {
                      name,
                      description,
                      items: collectionUrls,
                      thumbnail: { url: thumbnail_url },
                      type: COL_TYPES.PLAYLIST,
                    };
                    doLocalCollectionCreate(createParams);
                  }
                  doHideModal();
                }}
              />
              <Button button="link" label={__('Cancel')} onClick={doHideModal} />
            </div>
          </>
        }
      />
    </Modal>
  );
}

export default ModalRemoveCollection;
