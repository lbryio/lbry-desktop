// @flow
import * as ICONS from 'constants/icons';
import { FormField } from 'component/common/form';
import Button from 'component/button';
import React, { useRef } from 'react';
import { generateStreamUrl } from 'util/lbrytv';
import { LBRY_TV_API } from 'config';

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

  const streamUrl = generateStreamUrl(name, claimId, LBRY_TV_API);
  let embedText = `<iframe width="560" height="315" src="${streamUrl}" allowfullscreen></iframe>`;
  function copyToClipboard() {
    const topRef = input.current;
    if (topRef && topRef.input && topRef.input.current) {
      topRef.input.current.select();
    }
    document.execCommand('copy');
  }

  function onFocus() {
    // We have to go a layer deep since the input is inside the form component
    const topRef = input.current;
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
        readOnly
        onFocus={onFocus}
      />
      <div className="card__actions card__actions--center">
        <Button
          icon={ICONS.COPY}
          button="inverse"
          onClick={() => {
            copyToClipboard();
            doToast({ message: snackMessage || 'Embed link copied' });
          }}
        />
      </div>
    </fieldset-section>
  );
}
