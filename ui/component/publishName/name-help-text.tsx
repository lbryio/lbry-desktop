import * as React from 'react';
import Button from 'component/button';
import { buildURI } from 'util/lbryURI';
import I18nMessage from 'component/i18nMessage';

type Props = {
  uri: string | null | undefined,
  myClaimForUri: StreamClaim | null | undefined,
  isStillEditing: boolean,
  onEditMyClaim: (arg1: any, arg2: string) => void
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
          {/* @ts-expect-error - TS2745 (ts-migration) */}
          <I18nMessage
            // @ts-expect-error - TS2322 (ts-migration)
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
          // @ts-expect-error - TS2322 (ts-migration)
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
