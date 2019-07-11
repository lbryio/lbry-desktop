// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import { FormField } from 'component/common/form';
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
    <Modal
      isOpen
      title="Remove File"
      contentLabel={__('Confirm File Remove')}
      type="confirm"
      confirmButtonLabel={__('Remove')}
      confirmButtonDisabled={!deleteChecked && !abandonChecked}
      onConfirmed={() => deleteFile(outpoint || '', deleteChecked, abandonChecked)}
      onAborted={closeModal}
    >
      <section className="card__content">
        <p>
          {__("Are you sure you'd like to remove")} <cite>{`"${title}"`}</cite> {__('from the LBRY app?')}
        </p>
      </section>
      <section className="card__content">
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
      </section>
    </Modal>
  );
}

export default ModalRemoveFile;
