import * as ACTIONS from 'constants/action_types';
import REWARDS from 'rewards';
import { Lbryio } from 'lbryinc';
import { doClaimRewardType } from 'redux/actions/rewards';
import { parseURI } from 'util/lbryURI';
import { doAlertWaitingForSync } from 'redux/actions/app';
import { doToast } from 'redux/actions/notifications';
import { selectSubscriptions } from 'redux/selectors/subscriptions';
import { parseFollowingFile, parseChannelUrl } from 'util/following-file';
import Lbry from 'lbry';

type SubscriptionArgs = {
  channelName: string,
  uri: string,
  notificationsDisabled?: boolean
};

export function doToggleSubscription(
  subscription: SubscriptionArgs,
  followToast: boolean,
  isSubscribed: boolean = false
) {
  return async (dispatch: Dispatch, getState: GetState) => {
    const {
      settings: { daemonSettings },
      sync: { prefsReady: ready },
    } = getState();

    if (!ready) {
      return dispatch(doAlertWaitingForSync());
    }

    const { share_usage_data: shareSetting } = daemonSettings;
    const isSharingData = shareSetting;

    if (!isSubscribed) {
      const subscriptionUri = subscription.uri;
      if (!subscriptionUri.startsWith('lbry://')) {
        throw Error(`Subscription uris must include the "lbry://" prefix.\nTried to subscribe to ${subscriptionUri}`);
      }
    }

    dispatch({
      type: !isSubscribed ? ACTIONS.CHANNEL_SUBSCRIBE : ACTIONS.CHANNEL_UNSUBSCRIBE,
      data: subscription,
    });

    // if the user isn't sharing data, keep the subscriptions entirely in the app
    if (isSharingData) {
      const { channelClaimId } = parseURI(subscription.uri);

      if (!isSubscribed) {
        // They are sharing data, we can store their subscriptions in our internal database
        // @ts-expect-error - TS2339 (ts-migration)
        Lbryio.call('subscription', 'new', {
          channel_name: subscription.channelName,
          claim_id: channelClaimId,
          notifications_disabled: subscription.notificationsDisabled,
        });

        dispatch(doClaimRewardType(REWARDS.TYPE_SUBSCRIPTION, { failSilently: true }));
      } else {
        // @ts-expect-error - TS2339 (ts-migration)
        Lbryio.call('subscription', 'delete', {
          claim_id: channelClaimId,
        });
      }
    }
    if (followToast) {
      dispatch(
        doToast({
          message: __(!isSubscribed ? 'You followed %CHANNEL_NAME%!' : 'Unfollowed %CHANNEL_NAME%.', {
            CHANNEL_NAME: subscription.channelName,
          }),
        })
      );
    }
  };
}

export function doChannelSubscribe(subscription: SubscriptionArgs, followToast: boolean = true) {
  return (dispatch: Dispatch) => {
    return dispatch(doToggleSubscription(subscription, followToast));
  };
}

export function doChannelUnsubscribe(subscription: SubscriptionArgs, followToast: boolean = true) {
  return (dispatch: Dispatch) => {
    return dispatch(doToggleSubscription(subscription, followToast, true));
  };
}

const IMPORT_RESOLVE_BATCH = 100;

export type FollowingImportResult = {
  added: number,
  alreadyFollowing: number,
  invalid: Array<string>
};

// Follows every channel in an exported following file (see util/following-file.js).
// Resolves to null if sync hasn't finished loading preferences yet.
export function doImportFollowing(text: string) {
  return async (dispatch: Dispatch, getState: GetState): Promise<FollowingImportResult | null | undefined> => {
    const state = getState();
    if (!state.sync.prefsReady) {
      dispatch(doAlertWaitingForSync());
      return null;
    }

    const { entries, unresolved, invalid } = parseFollowingFile(text);

    // Channels given by name or short claim ID: look up their permanent URL.
    for (let i = 0; i < unresolved.length; i += IMPORT_RESOLVE_BATCH) {
      const batch = unresolved.slice(i, i + IMPORT_RESOLVE_BATCH);
      // The daemon answers with each URL's claim (or { error }). ResolveResponse doesn't describe that shape.
      const resolved: {
        [key: string]: any
      } = await Lbry.resolve({ urls: batch.map((item) => item.uri) });
      batch.forEach(({ uri, notificationsDisabled, position }) => {
        const claim = resolved && resolved[uri];
        if (claim && claim.value_type === 'channel' && claim.permanent_url) {
          entries.push({ uri: claim.permanent_url, channelName: claim.name, notificationsDisabled, position });
        } else {
          invalid.push(uri);
        }
      });
    }

    // Back in the file's order, now that resolved channels have been added at the end.
    entries.sort((x, y) => x.position - y.position);

    // Saved follows can have a short claim ID, which is only unique among channels with the same name.
    const followed = selectSubscriptions(state)
      .map((sub) => parseChannelUrl(sub.uri))
      .filter(Boolean);
    const isFollowed = (name: unknown, id: unknown) =>
      followed.some(
        (f) =>
// @ts-expect-error - TS2339 - Property 'startsWith' does not exist on type 'unknown'.
          f.channelClaimId && (f.channelClaimId === id || (f.channelName === name && id.startsWith(f.channelClaimId)))
      );

    const toAdd: unknown = [];
    const addedIds = new Set();
    entries.forEach((entry) => {
      const channel = parseChannelUrl(entry.uri);
      const id = channel && channel.channelClaimId;
      if (channel && id && !isFollowed(channel.channelName, id) && !addedIds.has(id)) {
        addedIds.add(id);
// @ts-expect-error - TS2339 - Property 'push' does not exist on type 'unknown'.
        toAdd.push({ ...entry, claimId: id });
      }
    });

    // The sidebar lists the newest follow first, so follow in reverse to keep the file's order.
    toAdd
// @ts-expect-error - TS2339 - Property 'slice' does not exist on type 'unknown'.
      .slice()
      .reverse()
      .forEach(({ uri, channelName, notificationsDisabled }) =>
        dispatch({ type: ACTIONS.CHANNEL_SUBSCRIBE, data: { uri, channelName, notificationsDisabled } })
      );

    // Same as following one channel at a time: only tell LBRY's servers if the user shares usage data.
// @ts-expect-error - TS2339 - Property 'length' does not exist on type 'unknown'.
    if (toAdd.length && state.settings.daemonSettings.share_usage_data) {
// @ts-expect-error - TS2339 - Property 'forEach' does not exist on type 'unknown'.
      toAdd.forEach((entry) => {
        // @ts-expect-error - TS2339 (ts-migration)
        Lbryio.call('subscription', 'new', {
          channel_name: entry.channelName,
          claim_id: entry.claimId,
          notifications_disabled: entry.notificationsDisabled,
        }).catch(() => {});
      });
      dispatch(doClaimRewardType(REWARDS.TYPE_SUBSCRIPTION, { failSilently: true }));
    }

    return {
// @ts-expect-error - TS2339 - Property 'length' does not exist on type 'unknown'.
      added: toAdd.length,
// @ts-expect-error - TS2339 - Property 'length' does not exist on type 'unknown'.
      alreadyFollowing: entries.length - toAdd.length,
      invalid,
    };
  };
}
