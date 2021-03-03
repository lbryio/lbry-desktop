// @flow
import * as React from 'react';
import Button from 'component/button';
import { buildURI } from 'lbry-redux';
import I18nMessage from 'component/i18nMessage';

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
    nameHelpText = __('You are currently editing this claim.');
  } else if (uri && myClaimForUri) {
    const editUri = buildURI({
      streamName: myClaimForUri.name,
      streamClaimId: myClaimForUri.claim_id,
    });

    nameHelpText = (
      <React.Fragment>
        <div className="error__text">
          <I18nMessage
            tokens={{
              existing_uri: (
                <u>
                  <em>{uri}</em>
                </u>
              ),
            }}
          >
            You already have a claim at %existing_uri%. Publishing will update (overwrite) your existing claim.
          </I18nMessage>
        </div>
        <Button
          button="link"
          label={__('Edit existing claim instead')}
          onClick={() => onEditMyClaim(myClaimForUri, editUri)}
        />
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
