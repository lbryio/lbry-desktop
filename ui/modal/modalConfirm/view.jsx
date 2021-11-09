// @flow
import React from 'react';
import type { Node } from 'react';
import Button from 'component/button';
import Card from 'component/common/card';
import Spinner from 'component/spinner';
import { Modal } from 'modal/modal';

type Props = {
  title: string,
  subtitle?: string | Node,
  body?: string | Node,
  labelOk?: string,
  labelCancel?: string,
  onConfirm: (closeModal: () => void, setIsBusy: (boolean) => void) => void,
  hideCancel?: boolean,
  // --- perform ---
  doHideModal: () => void,
};

export default function ModalConfirm(props: Props) {
  const { title, subtitle, body, labelOk, labelCancel, onConfirm, hideCancel, doHideModal } = props;
  const [isBusy, setIsBusy] = React.useState(false);

  function handleOnClick() {
    if (onConfirm) {
      onConfirm(doHideModal, setIsBusy);
    }
  }

  function getOkLabel() {
    return isBusy ? <Spinner type="small" /> : labelOk || __('OK');
  }

  function getCancelLabel() {
    return labelCancel || __('Cancel');
  }

  return (
    <Modal isOpen type="card" onAborted={doHideModal}>
      <Card
        title={title}
        subtitle={subtitle}
        body={body}
        actions={
          <>
            <div className="section__actions">
              <Button button="primary" label={getOkLabel()} disabled={isBusy} onClick={handleOnClick} />
              {!hideCancel && <Button button="link" label={getCancelLabel()} disabled={isBusy} onClick={doHideModal} />}
            </div>
          </>
        }
      />
    </Modal>
  );
}
