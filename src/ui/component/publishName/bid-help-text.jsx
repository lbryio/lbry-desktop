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
    } else if (!amountNeededForTakeover) {
      bidHelpText = __('Any amount will give you the winning bid.');
    } else {
      // @i18nfixme
      bidHelpText = `${__('If you bid more than')} ${amountNeededForTakeover} LBC, ${__(
        'when someone navigates to'
      )} ${uri} ${__('it will load your published content')}. ${__(
        'However, you can get a longer version of this URL for any bid'
      )}.`;
    }
  } else {
    bidHelpText = __('This LBC remains yours and the deposit can be undone at any time.');
  }

  return bidHelpText;
}

export default BidHelpText;
