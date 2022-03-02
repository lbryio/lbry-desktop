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
  hideCancel?: boolean,
  onConfirm: (closeModal: () => void, setIsBusy: (boolean) => void) => void,
  // --- perform ---
  doHideModal: () => void,
};

export default function ModalConfirm(props: Props) {
  const { title, subtitle, body, labelOk, labelCancel, hideCancel, onConfirm, doHideModal } = props;

  const [isBusy, setIsBusy] = React.useState(false);

  function handleOnClick() {
    if (onConfirm) {
      onConfirm(doHideModal, setIsBusy);
    }
  }

  return (
    <Modal isOpen type="card" onAborted={doHideModal}>
      <Card
        title={title}
        subtitle={subtitle}
        body={body}
        actions={
          <div className="section__actions">
            <Button
              button="primary"
              label={isBusy ? <Spinner type="small" /> : labelOk || __('OK')}
              disabled={isBusy}
              onClick={handleOnClick}
            />

            {!hideCancel && (
              <Button button="link" label={labelCancel || __('Cancel')} disabled={isBusy} onClick={doHideModal} />
            )}
          </div>
        }
      />
    </Modal>
  );
}
