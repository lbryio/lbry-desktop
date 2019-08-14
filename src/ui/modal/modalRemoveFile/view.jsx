// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import { Form, FormField } from 'component/common/form';
import Button from 'component/button';
import usePersistedState from 'util/use-persisted-state';

type Props = {
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
  const { claim, claimIsMine, closeModal, deleteFile, fileInfo, title } = props;
  const [deleteChecked, setDeleteChecked] = usePersistedState('modal-remove-file:delete', true);
  const [abandonChecked, setAbandonChecked] = usePersistedState('modal-remove-file:abandon', true);
  const { txid, nout } = claim;
  const outpoint = fileInfo ? fileInfo.outpoint : `${txid}:${nout}`;

  return (
    <Modal isOpen title="Remove File" contentLabel={__('Confirm File Remove')} type="custom" onAborted={closeModal}>
      <section>
        <p>
          {__("Are you sure you'd like to remove")} <cite>{`"${title}"`}</cite> {__('from the LBRY app?')}
        </p>
      </section>
      <Form onSubmit={() => deleteFile(outpoint || '', deleteChecked, abandonChecked)}>
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
          <Button
            autoFocus
            button="primary"
            label={__('OK')}
            disabled={!deleteChecked && !abandonChecked}
            onClick={() => deleteFile(outpoint || '', deleteChecked, claimIsMine ? abandonChecked : false)}
          />
          <Button button="link" label={__('Cancel')} onClick={closeModal} />
        </div>
      </Form>
    </Modal>
  );
}

export default ModalRemoveFile;
