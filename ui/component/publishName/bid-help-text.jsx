// @flow
type Props = {
  uri: ?string,
  isResolvingUri: boolean,
  amountNeededForTakeover: number,
};

function BidHelpText(props: Props) {
  const { uri, isResolvingUri, amountNeededForTakeover } = props;

  let bidHelpText;

  if (uri) {
    if (isResolvingUri) {
      bidHelpText = __('Checking the winning claim amount...');
    } else if (amountNeededForTakeover === 0) {
      bidHelpText = __('You currently have the highest bid for this name.');
    } else if (!amountNeededForTakeover) {
      bidHelpText = __(
        'Any amount will give you the highest bid, but larger amounts help your content be trusted and discovered.'
      );
    } else {
      bidHelpText = __(
        'If you bid more than %amount% LBRY Credits, when someone navigates to %uri%, it will load your published content. However, you can get a longer version of this URL for any bid.',
        {
          amount: amountNeededForTakeover,
          uri: uri,
        }
      );
    }
  } else {
    bidHelpText = __('These LBRY Credits remain yours and the deposit can be undone at any time.');
  }

  return bidHelpText;
}

export default BidHelpText;
