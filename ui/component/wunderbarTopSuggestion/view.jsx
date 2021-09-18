// @flow
import React from 'react';
import LbcSymbol from 'component/common/lbc-symbol';
import WunderbarSuggestion from 'component/wunderbarSuggestion';

type Props = {
  winningUri: ?string,
  doResolveUris: (Array<string>) => void,
  uris: Array<string>,
  resolvingUris: boolean,
  preferEmbed: boolean,
};

export default function WunderbarTopSuggestion(props: Props) {
  const { uris, resolvingUris, winningUri, doResolveUris, preferEmbed } = props;

  const stringifiedUris = JSON.stringify(uris);
  React.useEffect(() => {
    if (stringifiedUris) {
      const arrayUris = JSON.parse(stringifiedUris);

      if (arrayUris.length > 0) {
        doResolveUris(arrayUris);
      }
    }
  }, [doResolveUris, stringifiedUris]);

  if (resolvingUris) {
    return (
      <div className="wunderbar__winning-claim">
        <div className="wunderbar__label wunderbar__placeholder-label" />

        <div className="wunderbar__suggestion wunderbar__placeholder-suggestion">
          <div className="wunderbar__placeholder-thumbnail" />
          <div className="wunderbar__placeholder-info" />
        </div>
        <hr className="wunderbar__top-separator" />
      </div>
    );
  }

  if (!winningUri || preferEmbed) {
    return null;
  }

  return (
    <>
      <div className="wunderbar__label">
        <LbcSymbol prefix={__('Most Supported')} />
      </div>

      <WunderbarSuggestion uri={winningUri} />
      <hr className="wunderbar__top-separator" />
    </>
  );
}
