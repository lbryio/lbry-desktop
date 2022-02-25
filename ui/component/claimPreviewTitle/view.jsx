// @flow
import React from 'react';
import TruncatedText from 'component/common/truncated-text';
import { stripLeadingAtSign } from 'util/string';

type Props = {
  uri: string,
  claim: ?Claim,
  title: string,
};

function ClaimPreviewTitle(props: Props) {
  const { title, claim } = props;

  return (
    <div className="claim-preview__title">
      {claim ? (
        <TruncatedText text={title || stripLeadingAtSign(claim.name)} lines={2} />
      ) : (
        <span>{__('Nothing here')}</span>
      )}
    </div>
  );
}

export default ClaimPreviewTitle;
