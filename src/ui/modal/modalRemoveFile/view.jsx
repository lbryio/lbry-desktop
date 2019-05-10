// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import { FormField } from 'component/common/form';

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

type State = {
  deleteChecked: boolean,
  abandonClaimChecked: boolean,
};

class ModalRemoveFile extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      deleteChecked: false,
      abandonClaimChecked: true,
    };

    (this: any).handleDeleteCheckboxClicked = this.handleDeleteCheckboxClicked.bind(this);
    (this: any).handleAbandonClaimCheckboxClicked = this.handleAbandonClaimCheckboxClicked.bind(this);
  }

  handleDeleteCheckboxClicked() {
    const { deleteChecked } = this.state;
    this.setState({
      deleteChecked: !deleteChecked,
    });
  }

  handleAbandonClaimCheckboxClicked() {
    const { abandonClaimChecked } = this.state;
    this.setState({
      abandonClaimChecked: !abandonClaimChecked,
    });
  }

  render() {
    const { claim, claimIsMine, closeModal, deleteFile, fileInfo, title } = this.props;
    const { deleteChecked, abandonClaimChecked } = this.state;
    const { txid, nout } = claim;
    const outpoint = fileInfo ? fileInfo.outpoint : `${txid}:${nout}`;

    return (
      <Modal
        isOpen
        title="Remove File"
        contentLabel={__('Confirm File Remove')}
        type="confirm"
        confirmButtonLabel={__('Remove')}
        onConfirmed={() => deleteFile(outpoint || '', deleteChecked, abandonClaimChecked)}
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
            onChange={this.handleDeleteCheckboxClicked}
          />

          {claimIsMine && (
            <FormField
              name="claim_abandon"
              label={__('Abandon the claim for this URI')}
              type="checkbox"
              checked={abandonClaimChecked}
              onChange={this.handleAbandonClaimCheckboxClicked}
            />
          )}
        </section>
      </Modal>
    );
  }
}

export default ModalRemoveFile;
