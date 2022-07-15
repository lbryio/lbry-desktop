// @flow
import * as ICONS from 'constants/icons';
import { FormField } from 'component/common/form';
import Button from 'component/button';
import React, { useRef } from 'react';
import { generateEmbedUrl, generateEmbedIframeData } from 'util/web';

type Props = {
  copyable: string,
  snackMessage: ?string,
  doToast: ({ message: string }) => void,
  label?: string,
  claim: Claim,
  includeStartTime: boolean,
  startTime: number,
  referralCode: ?string,
  newestType?: boolean,
};

export default function EmbedTextArea(props: Props) {
  const { doToast, snackMessage, label, claim, includeStartTime, startTime, referralCode, newestType } = props;
  const { claim_id: claimId, name } = claim;
  const input = useRef();

  const streamUrl = generateEmbedUrl(name, claimId, includeStartTime && startTime, referralCode, newestType);
  const { html: embedText } = generateEmbedIframeData(streamUrl);

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
    <div className="section">
      <FormField
        type="textarea"
        className="form-field--copyable"
        label={label}
        value={embedText || ''}
        ref={input}
        onFocus={onFocus}
        readOnly
      />

      <div className="section__actions">
        <Button
          icon={ICONS.COPY}
          button="secondary"
          label={__('Copy')}
          onClick={() => {
            copyToClipboard();
          }}
        />
      </div>
    </div>
  );
}
