// @flow
import React from 'react';

import './style.scss';
import Button from 'component/button';
import Card from 'component/common/card';
import Spinner from 'component/spinner';
import { Modal } from 'modal/modal';

type Props = {
  pendingActions: Array<string>,
  onConfirm: () => void,
  // --- perform ---
  doHideModal: () => void,
};

export default function ModalSignOut(props: Props) {
  const { pendingActions, onConfirm, doHideModal } = props;

  const [isBusy, setIsBusy] = React.useState(false);

  function handleOnClick() {
    if (onConfirm) {
      setIsBusy(true);
      onConfirm();
    }
  }

  return (
    <Modal isOpen type="custom" className="modal-sign-out">
      <Card
        title={__('Sign Out')}
        body={
          <div>
            <p className="section__subtitle">{__('There are pending actions.')}</p>
            <div className="section section--padded-small border-std">
              <ul>
                {pendingActions.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
            <p className="section__subtitle">{__('Do you want to proceed with signing out?')}</p>
          </div>
        }
        actions={
          <div className="section__actions">
            <Button
              button="primary"
              label={isBusy ? <Spinner type="small" /> : __('Sign Out')}
              disabled={isBusy}
              onClick={handleOnClick}
            />

            <Button button="link" label={__('Cancel')} disabled={isBusy} onClick={doHideModal} />
          </div>
        }
      />
    </Modal>
  );
}
