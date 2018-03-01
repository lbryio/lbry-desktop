// @flow
import * as React from "react";
import Button from 'component/link';

type Props = {
  uri: ?string,
  isResolvingUri: boolean,
  winningBidForClaimUri: ?number,
  claimIsMine: ?boolean,
  onEditMyClaim: (any) => void,
}

class BidHelpText extends React.PureComponent<Props> {
  render() {
    const { uri, isResolvingUri, winningBidForClaimUri, claimIsMine, onEditMyClaim } = this.props;

    if (!uri) {
      return __("Create a URL for this content");
    }

    if (isResolvingUri) {
      return __("Checking the winning claim amount...")
    }

    if (claimIsMine) {
      return (
      <React.Fragment>
        {__("You already have a claim at")}{` ${uri} `}
        <Button fakeLink label="Edit it" onClick={onEditMyClaim} /><br />
        {__("Publishing will update your existing claim.")}
      </React.Fragment>
      )
    }

    return winningBidForClaimUri ? (
      <React.Fragment>
        {__("A deposit greater than")}{" "}{winningBidForClaimUri}{" "}
        {__("is needed to win")}{` ${uri}. `}
        {__("However, you can still get this URL for any amount")}
      </React.Fragment>
    ) : __("Any amount will give you the winning bid");
  }
}

export default BidHelpText;
