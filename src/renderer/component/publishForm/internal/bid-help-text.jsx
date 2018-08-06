// @flow
import * as React from 'react';
import Button from 'component/button';
import { buildURI } from 'lbry-redux';
import type { Claim } from 'types/claim';

type Props = {
  uri: ?string,
  isResolvingUri: boolean,
  winningBidForClaimUri: ?number,
  myClaimForUri: ?Claim,
  isStillEditing: boolean,
  onEditMyClaim: (any, string) => void,
};

class BidHelpText extends React.PureComponent<Props> {
  render() {
    const {
      uri,
      isResolvingUri,
      winningBidForClaimUri,
      myClaimForUri,
      onEditMyClaim,
      isStillEditing,
    } = this.props;

    if (!uri) {
      return __('Create a URL for this content.');
    }

    if (isStillEditing) {
      return __(
        'You are currently editing this claim. If you change the URL, you will need to reselect a file.'
      );
    }

    if (isResolvingUri) {
      return __('Checking the winning claim amount...');
    }

    if (myClaimForUri) {
      const editUri = buildURI({
        contentName: myClaimForUri.name,
        claimId: myClaimForUri.claim_id,
      });

      return (
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

    return winningBidForClaimUri ? (
      <React.Fragment>
        {__('A deposit greater than')} {winningBidForClaimUri} {__('is needed to win')}
        {` ${uri}. `}
        {__('However, you can still get this URL for any amount.')}
      </React.Fragment>
    ) : (
      __('Any amount will give you the winning bid.')
    );
  }
}

export default BidHelpText;
