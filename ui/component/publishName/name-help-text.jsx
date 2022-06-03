// @flow
import * as React from 'react';
import Button from 'component/button';
import { buildURI } from 'util/lbryURI';
import I18nMessage from 'component/i18nMessage';

function isUriPendingUpload(uri: ?string, currentUploadNames: Array<string>) {
  const protocol = 'lbry://';
  const uriName = uri && uri.startsWith(protocol) ? uri.substring(protocol.length) : uri;
  return currentUploadNames.includes(uriName);
}

type Props = {
  uri: ?string,
  myClaimForUri: ?StreamClaim,
  myClaimForUriCaseInsensitive: ?StreamClaim,
  currentUploads: { [key: string]: FileUploadItem },
  isStillEditing: boolean,
  onEditMyClaim: (any, string) => void,
};

function NameHelpText(props: Props) {
  const { uri, myClaimForUri, myClaimForUriCaseInsensitive, currentUploads, onEditMyClaim, isStillEditing } = props;

  const currentUploadNames: Array<string> = React.useMemo(() => {
    // $FlowFixMe - unable to resolve mixed
    return Object.values(currentUploads).map((x) => (x.params ? x.params.name : ''));
  }, [currentUploads]);

  let nameHelpText;

  if (isStillEditing) {
    nameHelpText = __('You are currently editing this claim.');
  } else if (isUriPendingUpload(uri, currentUploadNames)) {
    nameHelpText = (
      <div className="error__text">
        {/* prettier-ignore */}
        <I18nMessage tokens={{ existing_uri: (<u><em>{uri}</em></u>) }}>
          You already have a pending upload at %existing_uri%.
        </I18nMessage>
      </div>
    );
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
  } else if (uri && myClaimForUriCaseInsensitive) {
    nameHelpText = <div className="error__text">{__('You already have a claim with this name.')}</div>;
  }

  return <React.Fragment>{nameHelpText && nameHelpText}</React.Fragment>;
}

export default NameHelpText;
