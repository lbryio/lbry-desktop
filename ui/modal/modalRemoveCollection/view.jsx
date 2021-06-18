// @flow
import React, { useState } from 'react';
import { Modal } from 'modal/modal';
import Button from 'component/button';
import Card from 'component/common/card';
import I18nMessage from 'component/i18nMessage';
import { useHistory } from 'react-router-dom';
import { FormField } from 'component/common/form';

type Props = {
  closeModal: () => void,
  collectionDelete: (string, ?string) => void,
  claim: Claim,
  collectionId: string,
  collectionName: string,
  uri: ?string,
  redirect: ?string,
};

function ModalRemoveCollection(props: Props) {
  const { closeModal, claim, collectionDelete, collectionId, collectionName, uri, redirect } = props;
  const title = claim && claim.value && claim.value.title;
  const { replace } = useHistory();
  const [confirmName, setConfirmName] = useState('');

  return (
    <Modal isOpen contentLabel={__('Confirm Collection Unpublish')} type="card" onAborted={closeModal}>
      <Card
        title={__('Delete List')}
        body={
          uri ? (
            <React.Fragment>
              <p>{__('This will permanently delete the list.')}</p>
              <p>{__('Type "%name%" to confirm.', { name: collectionName })}</p>
              <FormField value={confirmName} type={'text'} onChange={(e) => setConfirmName(e.target.value)} />
            </React.Fragment>
          ) : (
            <I18nMessage tokens={{ title: <cite>{uri && title ? `"${title}"` : `"${collectionName}"`}</cite> }}>
              Are you sure you'd like to remove collection %title%?
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
                  collectionDelete(collectionId, uri ? 'resolved' : undefined);
                  closeModal();
                }}
              />
              <Button button="link" label={__('Cancel')} onClick={closeModal} />
            </div>
          </>
        }
      />
    </Modal>
  );
}

export default ModalRemoveCollection;
