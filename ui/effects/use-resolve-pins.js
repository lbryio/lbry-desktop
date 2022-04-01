// @flow
import React from 'react';
import useFetched from 'effects/use-fetched';

type Props = {
  pins?: { urls?: Array<string>, claimIds?: Array<string>, onlyPinForOrder?: string },
  claimsById: { [string]: Claim },
  doResolveClaimIds: (Array<string>) => Promise<any>,
  doResolveUris: (Array<string>, boolean) => Promise<any>,
};

export default function useResolvePins(props: Props) {
  const { pins, claimsById, doResolveClaimIds, doResolveUris } = props;

  const [resolvedPinUris, setResolvedPinUris] = React.useState(pins ? undefined : null);
  const [resolvingPinUris, setResolvingPinUris] = React.useState(false);
  const hasResolvedPinUris = useFetched(resolvingPinUris);

  React.useEffect(() => {
    if (resolvedPinUris === undefined && pins && !resolvingPinUris) {
      if (pins.claimIds) {
        // setResolvingPinUris is only needed for claim_search.
        // doResolveUris uses selectResolvingUris internally to prevent double call.
        setResolvingPinUris(true);

        // We can't use .then() here to grab the `claim_search` uris directly,
        // because we skip those that are already resolved. Instead, we mark a
        // flag here, then populate the array in the other effect below in the
        // next render cycle (redux would be updated by then). Pretty dumb.
        // $FlowFixMe: already checked for null `pins`, but flow can't see it when there's code above it? Wow.
        doResolveClaimIds(pins.claimIds).finally(() => setResolvingPinUris(false));
      } else if (pins.urls) {
        doResolveUris(pins.urls, true).finally(() => setResolvedPinUris(pins.urls));
      } else {
        setResolvedPinUris(null);
      }
    }
  }, [resolvedPinUris, pins, doResolveUris, doResolveClaimIds, resolvingPinUris]);

  React.useEffect(() => {
    if (hasResolvedPinUris) {
      if (pins && pins.claimIds) {
        setResolvedPinUris(pins.claimIds.map<string>((id) => claimsById[id]?.canonical_url));
      }
    }
    // Only do this over a false->true->false transition for hasResolvedPinUris.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasResolvedPinUris]);

  return resolvedPinUris;
}
