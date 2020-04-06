// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import { FormField } from 'component/common/form';
import Button from 'component/button';
import usePersistedState from 'effects/use-persisted-state';
import Card from 'component/common/card';
import I18nMessage from 'component/i18nMessage';

type Props = {
  uri: string,
  claim: StreamClaim,
  claimIsMine: boolean,
  closeModal: () => void,
  deleteFile: (string, boolean, boolean) => void,
  title: string,
  fileInfo?: {
    outpoint: ?string,
  },
};

function ModalRemoveFile(props: Props) {
  const { uri, claimIsMine, closeModal, deleteFile, title, claim } = props;
  const [deleteChecked, setDeleteChecked] = usePersistedState('modal-remove-file:delete', true);
  const [abandonChecked, setAbandonChecked] = usePersistedState('modal-remove-file:abandon', true);

  return (
    <Modal isOpen contentLabel={__('Confirm File Remove')} type="card" onAborted={closeModal}>
      <Card
        title="Remove File"
        subtitle={
          <I18nMessage tokens={{ title: <cite>{`"${title}"`}</cite> }}>
            Are you sure you'd like to remove %title% from LBRY?
          </I18nMessage>
        }
        body={
          <React.Fragment>
            {/* @if TARGET='app' */}
            <FormField
              name="file_delete"
              label={__('Delete this file from my computer')}
              type="checkbox"
              checked={deleteChecked}
              onChange={() => setDeleteChecked(!deleteChecked)}
            />
            {/* @endif */}

            {claimIsMine && (
              <React.Fragment>
                <FormField
                  name="claim_abandon"
                  label={__('Abandon on blockchain (reclaim %amount% LBC)', { amount: claim.amount })}
                  type="checkbox"
                  checked={abandonChecked}
                  onChange={() => setAbandonChecked(!abandonChecked)}
                />
                {abandonChecked === true && (
                  <p className="help error__text">This action is permanent and cannot be undone.</p>
                )}

                {/* @if TARGET='app' */}
                {abandonChecked === false && deleteChecked && (
                  <p className="help">This file will be removed from your Library and Downloads folder.</p>
                )}
                {!deleteChecked && (
                  <p className="help">
                    This file will be removed from your Library but will remain in your Downloads folder.
                  </p>
                )}
                {/* @endif */}
              </React.Fragment>
            )}
          </React.Fragment>
        }
        actions={
          <div className="card__actions">
            <Button
              button="primary"
              label={__('OK')}
              onClick={() => deleteFile(uri, deleteChecked, claimIsMine ? abandonChecked : false)}
            />
            <Button button="link" label={__('Cancel')} onClick={closeModal} />
          </div>
        }
      />
    </Modal>
  );
}

export default ModalRemoveFile;
