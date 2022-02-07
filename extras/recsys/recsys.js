import { RECSYS_ENDPOINT } from 'config';
import { selectUser } from 'redux/selectors/user';
import { makeSelectRecommendedRecsysIdForClaimId } from 'redux/selectors/search';
import { v4 as Uuidv4 } from 'uuid';
import { parseURI } from 'util/lbryURI';
import * as SETTINGS from 'constants/settings';
import { makeSelectClaimForUri } from 'redux/selectors/claims';
import { selectPlayingUri, selectPrimaryUri } from 'redux/selectors/content';
import { selectClientSetting, selectDaemonSettings } from 'redux/selectors/settings';
import { history } from 'ui/store';

const recsysEndpoint = RECSYS_ENDPOINT;
const recsysId = 'lighthouse-v0';

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

const recsys = {
  entries: {},
  debug: false,
  /**
   * Provides for creating, updating, and sending Clickstream data object Entries.
   * Entries are Created either when recommendedContent loads, or when recommendedContent is clicked.
   * If recommended content is clicked, An Entry with parentUuid is created.
   * On page load, find an empty entry with your claimId, or create a new entry and record to it.
   * The entry will be populated with the following:
   *  - parentUuid // optional
   *  - Uuid
   *  - claimId
   *  - recommendedClaims [] // optionally empty
   *  - playerEvents [] // optionally empty
   *  - recommendedClaimsIndexClicked [] // optionally empty
   *  - UserId
   *  - pageLoadedAt
   *  - isEmbed
   *  - pageExitedAt
   *  - autoplay
   *  - recsysId // optional
   */

  /**
   * Function: onClickedRecommended()
   * Called when RecommendedContent was clicked.
   * Adds index of clicked recommendation to parent entry
   * Adds new Entry with parentUuid for destination page
   * @param parentClaimId: string,
   * @param newClaimId: string,
   */
  onClickedRecommended: function (parentClaimId, newClaimId) {
    const parentEntry = recsys.entries[parentClaimId] ? recsys.entries[parentClaimId] : null;
    const parentUuid = parentEntry['uuid'];
    const parentRecommendedClaims = parentEntry['recClaimIds'] || [];
    const parentClickedIndexes = parentEntry['recClickedVideoIdx'] || [];
    const indexClicked = parentRecommendedClaims.indexOf(newClaimId);

    if (parentUuid) {
      recsys.createRecsysEntry(newClaimId, parentUuid);
    }
    parentClickedIndexes.push(indexClicked);
    recsys.log('onClickedRecommended', { parentClaimId, newClaimId });
  },

  /**
   * Page was loaded. Get or Create entry and populate it with default data, plus recommended content, recsysId, etc.
   * Called from recommendedContent component
   */
  onRecsLoaded: function (claimId, uris) {
    if (window && window.store) {
      const state = window.store.getState();
      if (!recsys.entries[claimId]) {
        recsys.createRecsysEntry(claimId);
      }
      const claimIds = getClaimIdsFromUris(uris);
      recsys.entries[claimId]['recsysId'] = makeSelectRecommendedRecsysIdForClaimId(claimId)(state) || recsysId;
      recsys.entries[claimId]['pageLoadedAt'] = Date.now();
      recsys.entries[claimId]['recClaimIds'] = claimIds;
    }
    recsys.log('onRecsLoaded', claimId);
  },

  /**
   * Creates an Entry with optional parentUuid
   * @param: claimId: string
   * @param: parentUuid: string (optional)
   */
  createRecsysEntry: function (claimId, parentUuid) {
    if (window && window.store && claimId) {
      const state = window.store.getState();
      const user = selectUser(state);
      const userId = user ? user.id : null;
      if (parentUuid) {
        // Make a stub entry that will be filled out on page load
        recsys.entries[claimId] = {
          uuid: Uuidv4(),
          parentUuid: parentUuid,
          uid: userId || null, // selectUser
          claimId: claimId,
          recClickedVideoIdx: [],
          pageLoadedAt: Date.now(),
          events: [],
        };
      } else {
        recsys.entries[claimId] = {
          uuid: Uuidv4(),
          uid: userId, // selectUser
          claimId: claimId,
          pageLoadedAt: Date.now(),
          recsysId: null,
          recClaimIds: [],
          recClickedVideoIdx: [],
          events: [],
        };
      }
    }
    recsys.log('createRecsysEntry', claimId);
  },

  /**
   * Send event for claimId
   * @param claimId
   * @param isTentative
   */
  sendRecsysEntry: function (claimId, isTentative) {
    const shareTelemetry =
      IS_WEB || (window && window.store && selectDaemonSettings(window.store.getState()).share_usage_data);

    if (recsys.entries[claimId] && shareTelemetry) {
      const data = JSON.stringify(recsys.entries[claimId]);
      try {
        navigator.sendBeacon(recsysEndpoint, data);
        if (!isTentative) {
          delete recsys.entries[claimId];
        }
      } catch (error) {
        console.log('no beacon for you', error);
      }
    }
    recsys.log('sendRecsysEntry', claimId);
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
  onPlayerDispose: function (claimId, isEmbedded) {
    if (window && window.store) {
      const state = window.store.getState();
      const playingUri = selectPlayingUri(state);
      const primaryUri = selectPrimaryUri(state);
      const onFilePage = playingUri === primaryUri;
      if (!onFilePage || isEmbedded) {
        if (isEmbedded) {
          recsys.entries[claimId]['isEmbed'] = true;
        }
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
      const claim = makeSelectClaimForUri(actualPlayingUri)(state);
      const playingClaimId = claim ? claim.claim_id : null;
      // const primaryUri = selectPrimaryUri(state);
      const floatingPlayer = selectClientSetting(state, SETTINGS.FLOATING_PLAYER);
      // When leaving page, if floating player is enabled, play will continue.
      Object.keys(recsys.entries).forEach((claimId) => {
        const shouldSkip = recsys.entries[claimId].parentUuid && !recsys.entries[claimId].recClaimIds;
        if (!shouldSkip && ((claimId !== playingClaimId && floatingPlayer) || !floatingPlayer)) {
          recsys.entries[claimId]['pageExitedAt'] = Date.now();
          // recsys.sendRecsysEntry(claimId); breaks pop out = off, not helping with browser close.
        }
        recsys.log('OnNavigate', claimId);
      });
    }
  },
};
// @if TARGET='web'
document.addEventListener('visibilitychange', function logData() {
  if (document.visibilityState === 'hidden') {
    Object.keys(recsys.entries).map((claimId) => recsys.sendRecsysEntry(claimId, true));
  }
});
// @endif

history.listen(() => {
  recsys.onNavigate();
});

export default recsys;
