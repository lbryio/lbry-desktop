// @flow
import * as React from 'react';

type Props = {
  uri: ?string,
  isResolvingUri: boolean,
  amountNeededForTakeover: ?number,
};

class BidHelpText extends React.PureComponent<Props> {
  render() {
    const { uri, isResolvingUri, amountNeededForTakeover } = this.props;
    let bidHelpText;

    if (uri) {
      if (isResolvingUri) {
        bidHelpText = __('Checking the winning claim amount...');
      } else if (!amountNeededForTakeover) {
        bidHelpText = __('Any amount will give you the winning bid.');
      } else {
        bidHelpText = `${__('If you bid more than')} ${amountNeededForTakeover} LBC, ${__(
          'when somone navigates to'
        )} ${uri} ${__('it will load your published content')}.`;
      }
    }

    return (
      <React.Fragment>
        {__('This LBC remains yours and the deposit can be undone at any time.')}
        <div>{bidHelpText}</div>
      </React.Fragment>
    );
  }
}

export default BidHelpText;
