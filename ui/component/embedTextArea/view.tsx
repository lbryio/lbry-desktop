import * as ICONS from "constants/icons";
import { FormField } from "component/common/form";
import Button from "component/button";
import React, { useRef } from "react";
import { generateEmbedUrl } from "util/web";

type Props = {
  copyable: string;
  snackMessage: string | null | undefined;
  doToast: (arg1: { message: string }) => void;
  label?: string;
  claim: Claim;
  includeStartTime: boolean;
  startTime: number;
  referralCode: string | null | undefined;
};

export default function EmbedTextArea(props: Props) {
  const { doToast, snackMessage, label, claim, includeStartTime, startTime, referralCode } = props;
  const { claim_id: claimId, name } = claim;
  const input = useRef();

  const streamUrl = generateEmbedUrl(name, claimId, includeStartTime, startTime, referralCode);
  const embedText = `<iframe id="lbry-iframe" width="560" height="315" src="${streamUrl}" allowfullscreen></iframe>`;

  function copyToClipboard() {
    const topRef = input.current;
    // @ts-expect-error - TS2339 - Property 'input' does not exist on type 'never'. | TS2339 - Property 'input' does not exist on type 'never'.
    if (topRef && topRef.input && topRef.input.current) {
      // @ts-expect-error - TS2339 - Property 'input' does not exist on type 'never'.
      topRef.input.current.select();
      document.execCommand("copy");
      doToast({ message: snackMessage || "Embed link copied" });
    }
  }

  function onFocus() {
    // We have to go a layer deep since the input is inside the form component
    const topRef = input && input.current;
    // @ts-expect-error - TS2339 - Property 'input' does not exist on type 'never'. | TS2339 - Property 'input' does not exist on type 'never'.
    if (topRef && topRef.input && topRef.input.current) {
      // @ts-expect-error - TS2339 - Property 'input' does not exist on type 'never'.
      topRef.input.current.select();
    }
  }

  return (
    <div className="section">
      <FormField
        type="textarea"
        // @ts-expect-error - TS2322 - Type '{ type: string; className: string; label: string; value: string; ref: MutableRefObject<undefined>; onFocus: () => void; readOnly: true; }' is not assignable to type 'IntrinsicAttributes & IntrinsicClassAttributes<FormField> & Pick<Readonly<Props> & Readonly<{ children?: ReactNode; }>, "error" | ... 22 more ... | "onChange"> & InexactPartial<...> & InexactPartial<...>'.
        className="form-field--copyable"
        label={label}
        value={embedText || ""}
        ref={input}
        onFocus={onFocus}
        readOnly
      />

      <div className="section__actions">
        <Button
          // @ts-expect-error - TS2322 (ts-migration)
          icon={ICONS.COPY}
          button="secondary"
          label={__("Copy")}
          onClick={() => {
            copyToClipboard();
          }}
        />
      </div>
    </div>
  );
}
