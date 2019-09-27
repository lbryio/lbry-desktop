// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import { Form, FormField } from 'component/common/form';
import Button from 'component/button';
import usePersistedState from 'effects/use-persisted-state';

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
  const { uri, claimIsMine, closeModal, deleteFile, title } = props;
  const [deleteChecked, setDeleteChecked] = usePersistedState('modal-remove-file:delete', true);
  const [abandonChecked, setAbandonChecked] = usePersistedState('modal-remove-file:abandon', true);

  return (
    <Modal isOpen title="Remove File" contentLabel={__('Confirm File Remove')} type="custom" onAborted={closeModal}>
      <section>
        <p>
          {__("Are you sure you'd like to remove")} <cite>{`"${title}"`}</cite> {__('from the LBRY app?')}
        </p>
      </section>
      <Form onSubmit={() => deleteFile(uri, deleteChecked, claimIsMine ? abandonChecked : false)}>
        <FormField
          name="file_delete"
          label={__('Also delete this file from my computer')}
          type="checkbox"
          checked={deleteChecked}
          onChange={() => setDeleteChecked(!deleteChecked)}
        />

        {claimIsMine && (
          <FormField
            name="claim_abandon"
            label={__('Abandon the claim for this URI')}
            type="checkbox"
            checked={abandonChecked}
            onChange={() => setAbandonChecked(!abandonChecked)}
          />
        )}
        <div className="card__actions">
          <Button type="submit" button="primary" label={__('OK')} />
          <Button button="link" label={__('Cancel')} onClick={closeModal} />
        </div>
      </Form>
    </Modal>
  );
}

export default ModalRemoveFile;
