// @flow
import * as React from 'react';
import Button from 'component/button';
import { buildURI } from 'lbry-redux';

type Props = {
  uri: ?string,
  myClaimForUri: ?StreamClaim,
  isStillEditing: boolean,
  onEditMyClaim: (any, string) => void,
};

function NameHelpText(props: Props) {
  const { uri, myClaimForUri, onEditMyClaim, isStillEditing } = props;

  let nameHelpText;

  if (isStillEditing) {
    nameHelpText = __('You are currently editing this claim. If you change the URL, you will need to reselect a file.');
  } else if (uri && myClaimForUri) {
    const editUri = buildURI({
      contentName: myClaimForUri.name,
      claimId: myClaimForUri.claim_id,
    });

    nameHelpText = (
      <React.Fragment>
        {__('You already have a claim at')}
        {` ${uri} `}
        <Button button="link" label="Edit it" onClick={() => onEditMyClaim(myClaimForUri, editUri)} />
        <br />
        {__('Publishing will update your existing claim.')}
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      {nameHelpText || (
        <span>{__('Create a URL for this content. Simpler names are easier to find and remember.')}</span>
      )}
    </React.Fragment>
  );
}

export default NameHelpText;
