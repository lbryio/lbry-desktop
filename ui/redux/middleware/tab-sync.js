// @flow
/**
 * Tab-sync setup.
 *
 * Whitelisting is chosen over blacklisting because:
 *   - Too many actions to blacklist.
 *   - There will be an error when an action contains unserializable data.
 *   - We might inadvertently sync per-tab settings like path changes and
 *     form values when new actions are created (developer unaware). Better to
 *     explicitly sync them here.
 *   - Safer to start small. Any important ones that slipped will still get
 *     sync'd by the wallet-sync mechanism anyway (albeit slower).
 */

import { createStateSyncMiddleware, initMessageListener } from 'redux-state-sync';
import { areCookiesEnabled } from 'util/saved-passwords';

function buildTabStateSyncMiddleware(whitelist: Array<string>) {
  if (!areCookiesEnabled()) {
    // Disable with a dummy; redux-state-sync chokes without storage permission.
    return () => (next: any) => (action: any) => {
      return next(action);
    };
  }

  return createStateSyncMiddleware({
    // Not sure why the `whitelist` parameter fails to filter out some actions.
    // Fortunately, there's the `predicate` variant, so manually do it here.
    predicate: (action) => {
      return typeof action === 'object' && whitelist.includes(action?.type);
    },
  });
}

export { buildTabStateSyncMiddleware, initMessageListener as initTabStateSync };
