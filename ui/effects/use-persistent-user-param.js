// @flow
import React from 'react';
import { useHistory } from 'react-router';
import usePersistedState from 'effects/use-persisted-state';

/**
 * Resolves and provides persistence for a user param.
 *
 * The double-state solution is to address this corner-case:
 *   1. Enter /$/popculture from sidebar.
 *      Assuming the current order is "Trending" as an example...
 *   2. Click "New"
 *   3. Click "Top"
 *   4. Click Back -- order must be "New"
 *   5. Click Back -- order must be "Trending"
 *
 * @param precedenceList
 * @param keyBase
 * @param keyDefaultValue
 * @returns {boolean}
 */
export default function usePersistentUserParam(precedenceList: Array<?any>, keyBase: string, keyDefaultValue: ?string) {
  const { action, location } = useHistory();

  const [stashed, setStashed] = usePersistedState(`${keyBase}-${location.pathname}`, keyDefaultValue);
  const [stashedOnEntry, setStashedOnEntry] = usePersistedState(
    `${keyBase}-entry-${location.pathname}`,
    keyDefaultValue
  );

  // Find the first non-null value in the precedence list:
  let param = precedenceList.find((x) => x);

  // If nothing was resolved, grab the stashed value, depending on the navigation action:
  if (!param) {
    if (action === 'POP') {
      // Reaching here means user have popped back to the page's entry point (e.g. '/$/tags' without any '?order=').
      param = stashedOnEntry;
    } else {
      // This is the direct entry into the page, so we load the user's previous value.
      param = stashed;
    }
  }

  React.useEffect(() => {
    setStashed(param);
  }, [param, setStashed]);

  React.useEffect(() => {
    if (action !== 'POP') {
      setStashedOnEntry(param);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- on mount only
  }, []);

  return param;
}
