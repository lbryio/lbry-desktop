// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import Card from 'component/common/card';
import Button from 'component/button';
import I18nMessage from 'component/i18nMessage';

type Props = {
  doHideModal: () => void,
  doSignOut: () => void,
};

function ModalRepost(props: Props) {
  const { doHideModal, doSignOut } = props;

  return (
    <Modal isOpen type="card">
      <Card
        title={__('Sign out')}
        subtitle={
          <I18nMessage
            tokens={{
              rename_wallet_instructions: (
                <Button
                  button="link"
                  label={__('rename your existing wallet')}
                  href="https://lbry.com/faq/lbry-directories"
                />
              ),
            }}
          >
            Your wallet data will remain intact. If you sign in with a different account, the wallets will be merged. To
            prevent this, you need to %rename_wallet_instructions% in the lbry/wallets directory.
          </I18nMessage>
        }
        actions={
          <div className="section__actions">
            <Button button="primary" label={__('Sign Out')} onClick={doSignOut} />
            <Button button="link" label={__('Cancel')} onClick={doHideModal} />
          </div>
        }
      />
    </Modal>
  );
}

export default ModalRepost;
