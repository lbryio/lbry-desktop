import React from "react";
import { Modal } from "modal/modal";
import Card from "component/common/card";
import Button from "component/button";
import I18nMessage from "component/i18nMessage";

type Props = {
  doHideModal: () => void;
  doSignOut: () => void;
};

function ModalRepost(props: Props) {
  const { doHideModal, doSignOut } = props;

  return (
    // @ts-expect-error - TS2322 - Type '{ children: Element; isOpen: true; type: string; }' is not assignable to type 'IntrinsicAttributes & ModalProps'.
    <Modal isOpen type="card">
      <Card
        title={__("Sign out")}
        subtitle={
          // @ts-expect-error - TS2745 (ts-migration)
          <I18nMessage
            // @ts-expect-error - TS2322 (ts-migration)
            tokens={{
              rename_wallet_instructions: (
                <Button
                  // @ts-expect-error - TS2322 (ts-migration)
                  button="link"
                  label={__("rename your existing wallet")}
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
            {/* @ts-expect-error - TS2322 (ts-migration) */}
            <Button button="primary" label={__("Sign Out")} onClick={doSignOut} />
            {/* @ts-expect-error - TS2322 (ts-migration) */}
            <Button button="link" label={__("Cancel")} onClick={doHideModal} />
          </div>
        }
      />
    </Modal>
  );
}

export default ModalRepost;
