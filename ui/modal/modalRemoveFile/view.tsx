import React from "react";
import { Modal } from "modal/modal";
import { FormField } from "component/common/form";
import Button from "component/button";
import usePersistedState from "effects/use-persisted-state";
import Card from "component/common/card";
import I18nMessage from "component/i18nMessage";
import LbcSymbol from "component/common/lbc-symbol";

type Props = {
  uri: string;
  claim: StreamClaim;
  claimIsMine: boolean;
  doResolveUri: (arg1: string) => void;
  closeModal: () => void;
  deleteFile: (arg1: string, arg2: boolean, arg3: boolean, arg4: boolean, arg5?: any) => void;
  doGoBack: boolean;
  title: string;
  fileInfo?: {
    outpoint: string | null | undefined;
  };
  isAbandoning: boolean;
};

function ModalRemoveFile(props: Props) {
  const { uri, claimIsMine, doResolveUri, closeModal, deleteFile, doGoBack = true, title, claim, isAbandoning } = props;
  const [deleteChecked, setDeleteChecked] = usePersistedState("modal-remove-file:delete", true);
  const [abandonChecked, setAbandonChecked] = usePersistedState("modal-remove-file:abandon", true);

  React.useEffect(() => {
    if (uri) {
      doResolveUri(uri);
    }
  }, [uri, doResolveUri]);

  return (
    // @ts-expect-error - TS2322 - Type '{ children: Element; isOpen: true; contentLabel: string; type: string; onAborted: () => void; }' is not assignable to type 'IntrinsicAttributes & ModalProps'.
    <Modal isOpen contentLabel={__("Confirm File Remove")} type="card" onAborted={closeModal}>
      <Card
        title={__("Remove File")}
        subtitle={
          // @ts-expect-error - TS2745, TS2322 (ts-migration)
          <I18nMessage tokens={{ title: <cite>{`"${title}"`}</cite> }}>
            Are you sure you'd like to remove %title%?
          </I18nMessage>
        }
        body={
          <React.Fragment>
            {/* @if TARGET='app' */}
            <FormField
              name="file_delete"
              label={__("Delete this file from my computer")}
              type="checkbox"
              // @ts-expect-error - TS2322 - Type '{ name: string; label: string; type: string; checked: any; onChange: () => any; }' is not assignable to type 'IntrinsicAttributes & IntrinsicClassAttributes<FormField> & Pick<Readonly<Props> & Readonly<{ children?: ReactNode; }>, "error" | ... 22 more ... | "onChange"> & InexactPartial<...> & InexactPartial<...>'.
              checked={deleteChecked}
              onChange={() => setDeleteChecked(!deleteChecked)}
            />
            {/* @endif */}

            {claimIsMine && (
              <React.Fragment>
                <FormField
                  name="claim_abandon"
                  label={
                    // @ts-expect-error - TS2745, TS2322 (ts-migration)
                    <I18nMessage tokens={{ lbc: <LbcSymbol postfix={claim.amount} /> }}>
                      Remove from blockchain (%lbc%)
                    </I18nMessage>
                  }
                  type="checkbox"
                  // @ts-expect-error - TS2322 (ts-migration)
                  checked={abandonChecked}
                  onChange={() => setAbandonChecked(!abandonChecked)}
                />
                {abandonChecked === true && (
                  <p className="help error__text">{__("This action is permanent and cannot be undone")}</p>
                )}

                {/* @if TARGET='app' */}
                {abandonChecked === false && deleteChecked && (
                  <p className="help">{__("This file will be removed from your Library and Downloads folder.")}</p>
                )}
                {!deleteChecked && (
                  <p className="help">
                    {__("This file will be removed from your Library but will remain in your Downloads folder.")}
                  </p>
                )}
                {/* @endif */}
              </React.Fragment>
            )}
          </React.Fragment>
        }
        actions={
          <>
            <div className="section__actions">
              <Button
                // @ts-expect-error - TS2322 (ts-migration)
                button="primary"
                label={isAbandoning ? __("Removing...") : __("OK")}
                disabled={isAbandoning || !(deleteChecked || abandonChecked)}
                onClick={() => deleteFile(uri, deleteChecked, claimIsMine ? abandonChecked : false, doGoBack, claim)}
              />
              {/* @ts-expect-error - TS2322 (ts-migration) */}
              <Button button="link" label={__("Cancel")} onClick={closeModal} />
            </div>
            <p className="help">{__("These changes will appear shortly.")}</p>
          </>
        }
      />
    </Modal>
  );
}

export default ModalRemoveFile;
