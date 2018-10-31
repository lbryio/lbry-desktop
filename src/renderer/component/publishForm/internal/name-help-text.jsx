// @flow
import * as React from 'react';
import Button from 'component/button';
import { buildURI } from 'lbry-redux';
import type { Claim } from 'types/claim';

type Props = {
  uri: ?string,
  myClaimForUri: ?Claim,
  isStillEditing: boolean,
  onEditMyClaim: (any, string) => void,
};

class NameHelpText extends React.PureComponent<Props> {
  render() {
    const { uri, myClaimForUri, onEditMyClaim, isStillEditing } = this.props;

    let nameHelpText;

    if (isStillEditing) {
      nameHelpText = __(
        'You are currently editing this claim. If you change the URL, you will need to reselect a file.'
      );
    } else if (uri && myClaimForUri) {
      const editUri = buildURI({
        contentName: myClaimForUri.name,
        claimId: myClaimForUri.claim_id,
      });

      nameHelpText = (
        <React.Fragment>
          {__('You already have a claim at')}
          {` ${uri} `}
          <Button
            button="link"
            label="Edit it"
            onClick={() => onEditMyClaim(myClaimForUri, editUri)}
          />
          <br />
          {__('Publishing will update your existing claim.')}
        </React.Fragment>
      );
    }

    return <React.Fragment>{nameHelpText || __('Create a URL for this content.')}</React.Fragment>;
  }
}

export default NameHelpText;
