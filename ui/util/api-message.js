// @flow

type ApiMsgConfig = {
  originalMsg: string | RegExp,
  replacement: string,
};

// prettier-ignore
const MESSAGE_MAP: Array<ApiMsgConfig> = Object.freeze([
  {
    originalMsg: /^your user name (.*) is too close to the creator's user name (.*) and may cause confusion. Please use another identity.$/,
    replacement: 'Your user name "%1%" is too close to the creator\'s user name "%2%" and may cause confusion. Please use another identity.',
  },
  {
    originalMsg: /^Slow mode is on. Please wait at most (.*) seconds before commenting again.$/,
    replacement: 'Slow mode is on. Please wait up to %1% seconds before commenting again.',
  },
  {
    originalMsg: /^the comment contents are blocked by (.*)$/,
    replacement: 'The comment contains contents that are blocked by %1%.',
  },
  {
    originalMsg: 'channel is blocked by publisher',
    replacement: 'Unable to comment. This channel has blocked you.',
  },
  {
    originalMsg: 'channel is not allowed to post comments',
    replacement: 'Unable to comment. Your channel has been blocked by an admin.',
  },
  {
    originalMsg: 'comments are disabled by the creator',
    replacement: 'Unable to comment. The content owner has disabled comments.',
  },
  {
    originalMsg: 'duplicate comment!',
    replacement: 'Please do not spam.',
  },
  {
    originalMsg: 'this creator has set minimum account age requirements that are not currently met',
    replacement: "Your channel does not meet the creator's minimum channel-age limit.",
  },
  {
    originalMsg: /^You only watched content (.*) days in the last week and it needs to be at least (.*) to get the reward.$/,
    replacement: 'You only watched content for %1% days in the last week. It needs to be at least %2% to get the reward.',
  },
  {
    originalMsg: 'Not enough funds to cover this transaction.',
    replacement: 'Insufficient credits to account for transaction fees.',
  },
  // {
  //   originalMsg: /^Earn a random reward of at least 0.1 LBC for watching cool stuff at least 3 days during the week. You can claim it again in (.*)$/,
  //   replacement: 'Earn a random reward of at least 0.1 LBC for watching cool stuff at least 3 days during the week. You can claim it again in %1%',
  // },
  // {
  //   originalMsg: /^Earn a random reward of at least 0.1 LBC for watching cool stuff at least 3 days during the week. You last claimed it (.*) ago!$/,
  //   replacement: 'Earn a random reward of at least 0.1 LBC for watching cool stuff at least 3 days during the week. You last claimed it %1% ago!',
  // },
]);

/**
 * Returns a re-mapped and localized version of the given API string.
 *
 * Ideally, the API should be returning a code and variable values, but
 * that won't be happening anytime soon (or ever), so this is the alternative.
 *
 * @param message
 * @returns {string}
 */
export function resolveApiMessage(message: string = '') {
  for (let n = 0; n < MESSAGE_MAP.length; ++n) {
    const config: ApiMsgConfig = MESSAGE_MAP[n];

    if (typeof config.originalMsg === 'string') {
      if (config.originalMsg === message) {
        return __(config.replacement);
      }
    } else {
      const match = message.match(config.originalMsg);
      if (match) {
        const subs = {};
        for (let i = 1; i < match.length; ++i) {
          subs[`${i}`] = match[i];
        }
        return __(config.replacement, subs);
      }
    }
  }

  return __(message);
}
