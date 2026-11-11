import React, { useState } from "react";
import { Modal } from "modal/modal";
import { FormField } from "component/common/form";
import * as txnTypes from "constants/transaction_types";
import Card from "component/common/card";
import Button from "component/button";
import I18nMessage from "component/i18nMessage";
import LbcSymbol from "component/common/lbc-symbol";

type Props = {
  closeModal: () => void;
  abandonTxo: (arg1: Txo, arg2: () => void) => void;
  abandonClaim: (arg1: Claim, arg2?: () => void | null | undefined) => void;
  tx: Txo;
  claim: Claim;
  cb: () => void;
  doResolveUri: (arg1: string) => void;
};

export default function ModalRevokeClaim(props: Props) {
  const { tx, claim, closeModal, abandonTxo, abandonClaim, cb, doResolveUri } = props;
  // @ts-expect-error - TS2339 - Property 'is_my_input' does not exist on type 'Claim | Txo'.
  const { value_type: valueType, type, normalized_name: name, is_my_input: isSupport } = tx || claim;
  const [channelName, setChannelName] = useState("");

  React.useEffect(() => {
    if (claim) {
      doResolveUri(claim.permanent_url);
    }
  }, [claim, doResolveUri]);

  const shouldConfirmChannel =
    valueType === txnTypes.CHANNEL || type === txnTypes.CHANNEL || (type === txnTypes.UPDATE && name.startsWith("@"));

  function getButtonLabel(type: string, isSupport: boolean) {
    if (isSupport && type === txnTypes.SUPPORT) {
      return __("Confirm Support Removal");
    } else if (type === txnTypes.SUPPORT) {
      return __("Confirm Tip Unlock");
    } else if (type === txnTypes.CHANNEL) {
      return __("Confirm Channel Removal");
    }
    return __("Confirm Removal");
  }

  function getMsgBody(type: string, isSupport: boolean, name: string) {
    if (isSupport && type === txnTypes.SUPPORT) {
      return (
        <React.Fragment>
          <p>{__("Are you sure you want to remove this boost?")}</p>
          <p>
            {/* @ts-expect-error - TS2745, TS2322 (ts-migration) */}
            <I18nMessage tokens={{ lbc: <LbcSymbol /> }}>
              These Credits are permanently yours and this boost can be removed at any time. Removing this boost will
              reduce discoverability and return %lbc% to your spendable balance.
            </I18nMessage>
          </p>
        </React.Fragment>
      );
    } else if (type === txnTypes.SUPPORT) {
      return (
        <React.Fragment>
          <p>{__("Are you sure you want to unlock these Credits?")}</p>
          <p>
            {__(
              "These Credits are permanently yours and can be unlocked at any time. Unlocking them allows you to spend them, but reduces discoverability of your content in lookups and search results. It is recommended you leave Credits locked until you need or want to spend them."
            )}
          </p>
        </React.Fragment>
      );
    } else if (shouldConfirmChannel) {
      return (
        <React.Fragment>
          <p>
            {__("This will permanently remove your channel. Content published under this channel will be orphaned.")}
          </p>
          <p>{__("Are you sure? Type %name% to confirm that you wish to remove the channel.", { name })}</p>
          {/* @ts-expect-error - TS2741 - Property 'name' is missing in type '{ type: string; onChange: (e: any) => void; }' but required in type 'Pick<Readonly<Props> & Readonly<{ children?: ReactNode; }>, "error" | "type" | "name" | "value" | "disabled" | "label" | "children" | "render" | ... 15 more ... | "onChange">'. */}
          <FormField type={"text"} onChange={(e) => setChannelName(e.target.value)} />
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <p>{__("Are you sure you want to remove this?")}</p>
        <p>
          {/* @ts-expect-error - TS2745, TS2322 (ts-migration) */}
          <I18nMessage tokens={{ lbc: <LbcSymbol /> }}>
            This will prevent others from resolving and accessing the content you published. It will return the %lbc% to
            your spendable balance.
          </I18nMessage>
        </p>
        <p className="help error__text"> {__("FINAL WARNING: This action is permanent and cannot be undone.")}</p>
      </React.Fragment>
    );
  }

  function revokeClaim() {
    tx ? abandonTxo(tx, cb) : abandonClaim(claim, cb);
    closeModal();
  }

  const label = getButtonLabel(type, isSupport);

  return (
    // @ts-expect-error - TS2322 - Type '{ children: Element; isOpen: true; contentLabel: string; type: string; onAborted: () => void; }' is not assignable to type 'IntrinsicAttributes & ModalProps'.
    <Modal isOpen contentLabel={label} type="card" onAborted={closeModal}>
      <Card
        title={label}
        body={getMsgBody(type, isSupport, name)}
        actions={
          <div className="section__actions">
            <Button
              // @ts-expect-error - TS2322 (ts-migration)
              disabled={shouldConfirmChannel && name !== channelName}
              button="primary"
              label={label}
              onClick={revokeClaim}
            />
            {/* @ts-expect-error - TS2322 (ts-migration) */}
            <Button button="link" label={__("Cancel")} onClick={closeModal} />
          </div>
        }
      />
    </Modal>
  );
}
