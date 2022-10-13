// @flow
import React from 'react';
import type { Node } from 'react';
import Button from 'component/button';
import Card from 'component/common/card';
import Spinner from 'component/spinner';
import { Modal } from 'modal/modal';
import BusyIndicator from 'component/common/busy-indicator';

type Props = {
  title: string,
  subtitle?: string | Node,
  body?: string | Node,
  labelOk?: string,
  labelCancel?: string,
  hideCancel?: boolean,
  busyMsg?: string,
  onConfirm: (closeModal: () => void, setIsBusy: (boolean) => void) => void,
  // --- perform ---
  doHideModal: () => void,
};

export default function ModalConfirm(props: Props) {
  const { title, subtitle, body, labelOk, labelCancel, hideCancel, busyMsg, onConfirm, doHideModal } = props;

  const [isBusy, setIsBusy] = React.useState(false);

  function handleOnClick() {
    if (onConfirm) {
      onConfirm(doHideModal, setIsBusy);
    }
  }

  return (
    <Modal isOpen type="custom" width="wide">
      <Card
        title={title}
        subtitle={subtitle}
        body={body}
        className="confirm__wrapper"
        actions={
          <div className="section__actions">
            {isBusy && busyMsg ? (
              <BusyIndicator message={busyMsg} />
            ) : (
              <Button
                button="primary"
                label={isBusy ? <Spinner type="small" /> : labelOk || __('OK')}
                disabled={isBusy}
                onClick={handleOnClick}
              />
            )}

            {!hideCancel && !(isBusy && busyMsg) && (
              <Button button="link" label={labelCancel || __('Cancel')} disabled={isBusy} onClick={doHideModal} />
            )}
          </div>
        }
      />
    </Modal>
  );
}
