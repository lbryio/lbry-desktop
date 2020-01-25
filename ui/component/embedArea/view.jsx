// @flow
import * as ICONS from 'constants/icons';
import { FormField } from 'component/common/form';
import Button from 'component/button';
import React, { useRef } from 'react';
import { generateEmbedUrl } from 'util/lbrytv';

type Props = {
  copyable: string,
  snackMessage: ?string,
  doToast: ({ message: string }) => void,
  label?: string,
  claim: Claim,
};

export default function EmbedArea(props: Props) {
  const { doToast, snackMessage, label, claim } = props;
  const { claim_id: claimId, name } = claim;
  const input = useRef();

  const streamUrl = generateEmbedUrl(name, claimId);
  let embedText = `<iframe width="560" height="315" src="${streamUrl}" allowfullscreen></iframe>`;

  function copyToClipboard() {
    const topRef = input.current;
    if (topRef && topRef.input && topRef.input.current) {
      topRef.input.current.select();
      document.execCommand('copy');
      doToast({ message: snackMessage || 'Embed link copied' });
    }
  }

  function onFocus() {
    // We have to go a layer deep since the input is inside the form component
    const topRef = input && input.current;
    if (topRef && topRef.input && topRef.input.current) {
      topRef.input.current.select();
    }
  }

  return (
    <fieldset-section>
      <FormField
        type="textarea"
        className="form-field--copyable"
        label={label}
        value={embedText || ''}
        ref={input}
        helper={
          <Button
            icon={ICONS.COPY}
            button="link"
            label={__('Copy')}
            onClick={() => {
              copyToClipboard();
            }}
          />
        }
        onFocus={onFocus}
      />
    </fieldset-section>
  );
}
