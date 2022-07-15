// @flow
import { RECSYS_ENDPOINT } from 'config';
import { selectUser } from 'redux/selectors/user';
import { selectRecommendedMetaForClaimId } from 'redux/selectors/search';
import { parseURI } from 'util/lbryURI';
import { getAuthToken } from 'util/saved-passwords';
import * as ACTIONS from 'constants/action_types';
import * as SETTINGS from 'constants/settings';
import { X_LBRY_AUTH_TOKEN } from 'constants/token';
import { makeSelectClaimForUri } from 'redux/selectors/claims';
import { selectPlayingUri, selectPrimaryUri } from 'redux/selectors/content';
import { selectClientSetting, selectDaemonSettings } from 'redux/selectors/settings';
import { selectIsSubscribedForClaimId } from 'redux/selectors/subscriptions';
// $FlowFixMe: cannot resolve..
import { history } from 'ui/store';

const recsysEndpoint = RECSYS_ENDPOINT;
const DEFAULT_RECSYS_ID = 'lighthouse-v0';

const getClaimIdsFromUris = (uris) => {
  return uris
    ? uris.map((uri) => {
        try {
          const { claimId } = parseURI(uri);
          return claimId;
        } catch (e) {
          return [];
        }
      })
    : [];
};

const recsys: Recsys = {
  entries: {},
  debug: false,

  /**
   * Provides for creating, updating, and sending Clickstream data object Entries.
   * Entries are Created either when recommendedContent loads, or when recommendedContent is clicked.
   * If recommended content is clicked, An Entry with parentUuid is created.
   * On page load, find an empty entry with your claimId, or create a new entry and record to it.
   */

  /**
   * Saves existing entries to persistence storage (in this case, Redux).
   */
  saveEntries: function () {
    if (window && window.store) {
      window.store.dispatch({
        type: ACTIONS.SET_RECSYS_ENTRIES,
        data: recsys.entries,
      });
    }
  },

  /**
   * Called when RecommendedContent was clicked.
   * Adds index of clicked recommendation to parent entry
   * Adds new Entry with parentUuid for destination page
   * @param parentClaimId: string,
   * @param newClaimId: string,
   */
  onClickedRecommended: function (parentClaimId, newClaimId) {
    const parentEntry = recsys.entries[parentClaimId] ? recsys.entries[parentClaimId] : null;
    const parentUuid = parentEntry ? parentEntry['uuid'] : '';
    const parentRecommendedClaims = parentEntry ? parentEntry['recClaimIds'] : [];
    const parentClickedIndexes = parentEntry ? parentEntry['recClickedVideoIdx'] : [];
    const indexClicked = parentRecommendedClaims.indexOf(newClaimId);

    if (parentUuid) {
      recsys.createRecsysEntry(newClaimId, parentUuid);
    }

    parentClickedIndexes.push(indexClicked);
    // recsys.log('onClickedRecommended', { parentClaimId, newClaimId });
    recsys.log('onClickedRecommended', newClaimId);
  },

  /**
   * Page was loaded. Get or Create entry and populate it with default data,
   * plus recommended content, recsysId, etc.
   * Called from recommendedContent component
   *
   * @param claimId The ID of the content the recommendations are for.
   * @param uris The recommended uris for `claimId`.
   * @param uuid Specific uuid to use (e.g. for FYP); uses the recommendation's
   *             uuid otherwise.
   */
  onRecsLoaded: function (claimId, uris, uuid = '') {
    if (window && window.store) {
      const state = window.store.getState();
      const recommendedMeta = selectRecommendedMetaForClaimId(state, claimId);

      if (!recsys.entries[claimId]) {
        recsys.createRecsysEntry(claimId, null, uuid || recommendedMeta.uuid);
      } else if (!recsys.entries[claimId].uuid) {
        // Stubs might not have the uuid ready at the time. Refill now.
        recsys.entries[claimId].uuid = uuid || recommendedMeta.uuid;
      }

      const claimIds = getClaimIdsFromUris(uris);
      recsys.entries[claimId]['recsysId'] = recommendedMeta.poweredBy || DEFAULT_RECSYS_ID;
      recsys.entries[claimId]['pageLoadedAt'] = Date.now();

      // It is possible that `claimIds` include `null | undefined` entries
      // instead of all being strings. I don't know if we should filter it,
      // or change the `recClaimIds` definition. Leaving as is for now since
      // any changes could affect existing recsys data set.
      // -----------
      // $FlowFixMe:
      recsys.entries[claimId]['recClaimIds'] = claimIds;
    }
    recsys.log('onRecsLoaded', claimId);
  },

  /**
   * Creates an Entry with optional parentUuid
   * @param: claimId: string
   * @param: parentUuid: string (optional)
   * @param uuid Specific uuid to use (e.g. for FYP); uses the recommendation's
   *             uuid otherwise.
   */
  createRecsysEntry: function (claimId, parentUuid, uuid = '') {
    if (window && window.store && claimId) {
      const state = window.store.getState();
      const recommendedMeta = selectRecommendedMetaForClaimId(state, claimId);
      const user = selectUser(state);
      const userId = user ? user.id : null;

      // Make a stub entry that will be filled out on page load
      // $FlowIgnore: not everything is defined since this is a stub
      recsys.entries[claimId] = {
        uuid: uuid || recommendedMeta.uuid,
        claimId: claimId,
        recClickedVideoIdx: [],
        pageLoadedAt: Date.now(),
        events: [],
        incognito: !(user && user.has_verified_email),
        isFollowing: selectIsSubscribedForClaimId(state, claimId),
      };

      if (parentUuid) {
        // $FlowFixMe: 'uid' should be a number, not null.
        recsys.entries[claimId].uid = userId || null;
        recsys.entries[claimId].parentUuid = parentUuid;
      } else {
        // $FlowFixMe: 'uid' should be a number, not null.
        recsys.entries[claimId].uid = userId;
        // $FlowFixMe: 'recsysId' should be a number, not null.
        recsys.entries[claimId].recsysId = null;
        recsys.entries[claimId].recClaimIds = [];
      }

      recsys.saveEntries();
    }
    recsys.log('createRecsysEntry', claimId);
  },

  updateRecsysEntry: function (claimId, key, value) {
    const entry = recsys.entries[claimId];
    if (entry) {
      entry[key] = value;
    }
  },

  /**
   * Send event for claimId
   * @param claimId
   * @param isTentative Visibility change rather than tab closed.
   */
  sendRecsysEntry: function (claimId, isTentative) {
    const shareTelemetry =
      IS_WEB || (window && window.store && selectDaemonSettings(window.store.getState()).share_usage_data);

    if (recsys.entries[claimId] && shareTelemetry) {
      // Exclude `events` in the submission https://github.com/OdyseeTeam/odysee-frontend/issues/1317
      const { events, ...entryData } = recsys.entries[claimId];
      const data = JSON.stringify(entryData);

      return fetch(recsysEndpoint, {
        method: 'POST',
        headers: {
          [X_LBRY_AUTH_TOKEN]: getAuthToken(),
          'Content-Type': 'application/json',
        },
        body: data,
      })
        .then(() => {
          if (!isTentative) {
            delete recsys.entries[claimId];
            recsys.saveEntries();
          }
        })
        .catch((err) => {
          console.log('RECSYS: failed to send entry', err);
        });
    }
    recsys.log('sendRecsysEntry', claimId);
  },

  sendEntries: function (entries, isResumedSend) {
    if (entries) {
      if (Object.keys(recsys.entries).length !== 0) {
        // Typically called on startup only.
        console.warn('RECSYS: sendEntries() called on non-empty state. Data will be overwritten.');
      }

      recsys.entries = entries;
    }

    Object.keys(recsys.entries).forEach((claimId) => {
      recsys.entries[claimId].isResumedSend = isResumedSend;
      recsys.sendRecsysEntry(claimId, false); // Send and delete.
    });
  },

  /**
   * A player event fired. Get the Entry for the claimId, and add the events
   * @param claimId
   * @param event
   */
  onRecsysPlayerEvent: function (claimId, event, isEmbedded) {
    const state = window.store.getState();
    const autoPlayNext = state && selectClientSetting(state, SETTINGS.AUTOPLAY_NEXT);
    // Check if played through (4 = onEnded) and handle multiple events at end
    if (recsys.entries[claimId] && !recsys.entries[claimId]['autoplay'] === true) {
      if (autoPlayNext && event.event === 4) {
        recsys.entries[claimId]['autoplay'] = true;
      } else {
        recsys.entries[claimId]['autoplay'] = false;
      }
    }
    if (!recsys.entries[claimId]) {
      recsys.createRecsysEntry(claimId);
      // do something to show it's floating or autoplay
    }
    if (isEmbedded) {
      recsys.entries[claimId]['isEmbed'] = true;
    }
    recsys.entries[claimId].events.push(event);
    recsys.log('onRecsysPlayerEvent', claimId);
  },

  log: function (callName, claimId) {
    if (recsys.debug) {
      console.log(`Call: ***${callName}***, ClaimId: ${claimId}, Recsys Entries`, Object.assign({}, recsys.entries));
    }
  },

  /**
   * Player closed. Check to see if primaryUri = playingUri
   * if so, send the Entry.
   */
  onPlayerDispose: function (claimId, isEmbedded, totalPlayingTime) {
    if (window && window.store) {
      const state = window.store.getState();
      const playingUri = selectPlayingUri(state);
      const primaryUri = selectPrimaryUri(state);
      const onFilePage = playingUri === primaryUri;
      if (!onFilePage || isEmbedded) {
        if (isEmbedded) {
          recsys.entries[claimId]['isEmbed'] = true;
        }
        recsys.entries[claimId]['totalPlayTime'] = totalPlayingTime;
        recsys.sendRecsysEntry(claimId);
      }
    }
    recsys.log('PlayerDispose', claimId);
  },

  // /**
  //  * File page unmount or change event
  //  * Check to see if playingUri, floatingEnabled, primaryUri === playingUri
  //  * If not, send the Entry.
  //  * If floating enabled, leaving file page will pop out player, leading to
  //  * more events until player is disposed. Don't send unless floatingPlayer playingUri
  //  */
  // onLeaveFilePage: function (primaryUri) {
  //   if (window && window.store) {
  //     const state = window.store.getState();
  //     const claim = makeSelectClaimForUri(primaryUri)(state);
  //     const claimId = claim ? claim.claim_id : null;
  //     const playingUri = selectPlayingUri(state);
  //     const actualPlayingUri = playingUri && playingUri.uri;
  //     // const primaryUri = selectPrimaryUri(state);
  //     const floatingPlayer = makeSelectClientSetting(SETTINGS.FLOATING_PLAYER)(state);
  //     // When leaving page, if floating player is enabled, play will continue.
  //     if (claimId) {
  //       recsys.entries[claimId]['pageExitedAt'] = Date.now();
  //     }
  //     const shouldSend =
  //       (claimId && floatingPlayer && actualPlayingUri && actualPlayingUri !== primaryUri) || !floatingPlayer || !actualPlayingUri;
  //     if (shouldSend) {
  //       recsys.sendRecsysEntry(claimId);
  //     }
  //     recsys.log('LeaveFile', claimId);
  //   }
  // },

  /**
   * Navigate event
   * Send all claimIds that aren't currently playing.
   */
  onNavigate: function () {
    if (window && window.store) {
      const state = window.store.getState();
      const playingUri = selectPlayingUri(state);
      const actualPlayingUri = playingUri && playingUri.uri;
      const claim = makeSelectClaimForUri(actualPlayingUri || '')(state);
      const playingClaimId = claim ? claim.claim_id : null;
      // const primaryUri = selectPrimaryUri(state);
      const floatingPlayer = selectClientSetting(state, SETTINGS.FLOATING_PLAYER);
      // When leaving page, if floating player is enabled, play will continue.
      Object.keys(recsys.entries).forEach((claimId) => {
        const shouldSkip = recsys.entries[claimId].parentUuid && !recsys.entries[claimId].recClaimIds;
        if (!shouldSkip && ((claimId !== playingClaimId && floatingPlayer) || !floatingPlayer)) {
          recsys.entries[claimId]['pageExitedAt'] = Date.now();
          recsys.saveEntries();
          // recsys.sendRecsysEntry(claimId); breaks pop out = off, not helping with browser close.
        }
        recsys.log('OnNavigate', claimId);
      });
    }
  },
};

history.listen(() => {
  recsys.onNavigate();
});

export default recsys;
