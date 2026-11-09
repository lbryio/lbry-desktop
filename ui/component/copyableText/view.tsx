import * as ICONS from 'constants/icons';
import { FormField } from 'component/common/form';
import Button from 'component/button';
import React, { useRef } from 'react';

type Props = {
  copyable: string,
  snackMessage: string | null | undefined,
  doToast: (
    arg1: {
      message: string
    },
  ) => void,
  label?: string,
  primaryButton?: boolean,
  name?: string,
  onCopy?: (arg1: string) => string,
  enableInputMask?: boolean
};

export default function CopyableText(props: Props) {
  const { copyable, doToast, snackMessage, label, primaryButton = false, name, onCopy, enableInputMask } = props;
  const [maskInput, setMaskInput] = React.useState(enableInputMask);

  const input = useRef();

  function handleCopyText() {
    if (enableInputMask) {
      navigator.clipboard
        .writeText(copyable)
        .then(() => {
          doToast({ message: snackMessage || __('Text copied') });
        })
        .catch(() => {
// @ts-expect-error - TS2345 - Argument of type '{ message: string; isError: boolean; }' is not assignable to parameter of type '{ message: string; }'.
          doToast({ message: __('Failed to copy.'), isError: true });
        });
    } else {
      const topRef = input.current;
// @ts-expect-error - TS2339 - Property 'input' does not exist on type 'never'. | TS2339 - Property 'input' does not exist on type 'never'.
      if (topRef && topRef.input && topRef.input.current) {
// @ts-expect-error - TS2339 - Property 'input' does not exist on type 'never'.
        topRef.input.current.select();
        if (onCopy) {
          // Allow clients to change the selection before making the copy.
// @ts-expect-error - TS2339 - Property 'input' does not exist on type 'never'.
          onCopy(topRef.input.current);
        }
      }

      document.execCommand('copy');
      doToast({ message: snackMessage || __('Text copied') });
    }
  }

  function onFocus() {
    // We have to go a layer deep since the input is inside the form component
    const topRef = input.current;
// @ts-expect-error - TS2339 - Property 'input' does not exist on type 'never'. | TS2339 - Property 'input' does not exist on type 'never'.
    if (topRef && topRef.input && topRef.input.current) {
// @ts-expect-error - TS2339 - Property 'input' does not exist on type 'never'.
      topRef.input.current.select();
    }
  }

  return (
    <FormField
      type={maskInput ? 'password' : 'text'}
// @ts-expect-error - TS2322 - Type '{ type: string; className: string; readOnly: true; name: string; label: string; value: string; ref: MutableRefObject<undefined>; onFocus: () => void; inputButton: Element; helper: Element; }' is not assignable to type 'IntrinsicAttributes & IntrinsicClassAttributes<FormField> & Pick<Readonly<Props> & Readonly<{ children?: ReactNode; }>, "error" | ... 22 more ... | "onChange"> & InexactPartial<...> & InexactPartial<...>'.
      className="form-field--copyable"
      readOnly
      name={name}
      label={label}
      value={copyable || ''}
      ref={input}
      onFocus={onFocus}
      inputButton={
        // @ts-expect-error - TS2322 (ts-migration)
        <Button button={primaryButton ? 'primary' : 'secondary'} icon={ICONS.COPY} onClick={handleCopyText} />
      }
      helper={
        enableInputMask && (
          // @ts-expect-error - TS2322 (ts-migration)
          <Button button="link" onClick={() => setMaskInput(!maskInput)} label={maskInput ? __('Show') : __('Hide')} />
        )
      }
    />
  );
}
