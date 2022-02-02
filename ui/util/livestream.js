// @flow

/**
 * Helper to extract livestream claim uris from the output of
 * `selectActiveLivestreams`.
 *
 * @param activeLivestreams Object obtained from `selectActiveLivestreams`.
 * @param channelIds List of channel IDs to filter the results with.
 * @returns {[]|Array<*>}
 */
export function getLivestreamUris(activeLivestreams: ?LivestreamInfo, channelIds: ?Array<string>) {
  let values = (activeLivestreams && Object.values(activeLivestreams)) || [];

  if (channelIds && channelIds.length > 0) {
    // $FlowFixMe
    values = values.filter((v) => channelIds.includes(v.creatorId) && Boolean(v.claimUri));
  } else {
    // $FlowFixMe
    values = values.filter((v) => Boolean(v.claimUri));
  }

  // $FlowFixMe
  return values.map((v) => v.claimUri);
}

export function getTipValues(superChatsByAmount: Array<Comment>) {
  let superChatsChannelUrls = [];
  let superChatsFiatAmount = 0;
  let superChatsLBCAmount = 0;

  if (superChatsByAmount) {
    superChatsByAmount.forEach((superChat) => {
      const { is_fiat: isFiat, support_amount: tipAmount, channel_url: uri } = superChat;

      if (isFiat) {
        superChatsFiatAmount = superChatsFiatAmount + tipAmount;
      } else {
        superChatsLBCAmount = superChatsLBCAmount + tipAmount;
      }
      superChatsChannelUrls.push(uri || '0');
    });
  }

  return { superChatsChannelUrls, superChatsFiatAmount, superChatsLBCAmount };
}
