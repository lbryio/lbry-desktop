// @flow
import React from 'react';
import LbcSymbol from 'component/common/lbc-symbol';
import WunderbarSuggestion from 'component/wunderbarSuggestion';
import { ComboboxOption } from '@reach/combobox';
import { parseURI } from 'lbry-redux';

type Props = {
  query: string,
  winningUri: ?string,
  doResolveUris: (Array<string>) => void,
};

export default function WunderbarTopClaim(props: Props) {
  const { query, winningUri, doResolveUris } = props;

  const uriFromQuery = `lbry://${query}`;

  let channelUriFromQuery;
  try {
    const { isChannel } = parseURI(uriFromQuery);

    if (!isChannel) {
      channelUriFromQuery = `lbry://@${query}`;
    }
  } catch (e) {}

  React.useEffect(() => {
    let urisToResolve = [];
    if (uriFromQuery) {
      urisToResolve.push(uriFromQuery);
    }

    if (channelUriFromQuery) {
      urisToResolve.push(channelUriFromQuery);
    }

    if (urisToResolve.length > 0) {
      doResolveUris(urisToResolve);
    }
  }, [doResolveUris, uriFromQuery, channelUriFromQuery]);

  if (!winningUri) {
    return null;
  }

  return (
    <>
      <ComboboxOption value={winningUri} className="wunderbar__winning-claim">
        <div className="wunderbar__label">
          <LbcSymbol postfix={__('Winning for "%query%"', { query })} />
        </div>

        <WunderbarSuggestion uri={winningUri} noComboBox />
      </ComboboxOption>
      <hr className="wunderbar__top-separator" />
    </>
  );
}
