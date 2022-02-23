// @flow
import React from 'react';
import { generateListSearchUrlParams, formatLbryUrlForWeb } from 'util/url';
import { useHistory } from 'react-router';

// Returns web blob from the streaming url
export default function usePlayNext(
  isFloating: boolean,
  collectionId: ?string,
  shouldPlayNext: boolean,
  nextListUri: ?string,
  previousListUri: ?string,
  doNavigate: boolean,
  doUriInitiatePlay: (uri: string, collectionId: ?string, isPlayable: ?boolean, isFloating: ?boolean) => void,
  resetState: () => void
) {
  const { push } = useHistory();

  const doPlay = React.useCallback(
    (playUri) => {
      if (!isFloating) {
        const navigateUrl = formatLbryUrlForWeb(playUri);

        push({
          pathname: navigateUrl,
          search: collectionId && generateListSearchUrlParams(collectionId),
          state: { collectionId, forceAutoplay: true, hideFloatingPlayer: true },
        });
      } else {
        doUriInitiatePlay(playUri, collectionId, true, isFloating);
      }

      resetState();
    },
    [collectionId, doUriInitiatePlay, isFloating, push, resetState]
  );

  React.useEffect(() => {
    if (!doNavigate) return;

    if (shouldPlayNext) {
      if (nextListUri) doPlay(nextListUri);
    } else {
      if (previousListUri) doPlay(previousListUri);
    }
  }, [doNavigate, doPlay, nextListUri, shouldPlayNext, previousListUri]);
}
