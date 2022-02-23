// @flow
import { doToast } from 'redux/actions/notifications';

// ****************************************************************************
// Helpers
// ****************************************************************************

export function doFailedSignatureToast(dispatch: Dispatch, channelName: string) {
  dispatch(
    doToast({
      message: __('Unable to verify signature for %channel%.', { channel: channelName }),
      isError: true,
    })
  );
}

export function devToast(dispatch: Dispatch, msg: string) {
  // @if process.env.NODE_ENV!='production'
  console.error(msg); // eslint-disable-line
  dispatch(doToast({ isError: true, message: `DEV: ${msg}` }));
  // @endif
}

// ****************************************************************************
// Error mapping
// ****************************************************************************

declare type CommentronErrorMap = {
  [string]: {
    commentron: string | RegExp,
    replacement: string,
    linkText?: string,
    linkTarget?: string,
  },
};

// prettier-ignore
const ERR_MAP: CommentronErrorMap = {
  SIMILAR_NAME: {
    commentron: /^your user name (.*) is too close to the creator's user name (.*) and may cause confusion. Please use another identity.$/,
    replacement: 'Your user name "%1%" is too close to the creator\'s user name "%2%" and may cause confusion. Please use another identity.',
  },
  SLOW_MODE_IS_ON: {
    commentron: /^Slow mode is on. Please wait at most (.*) seconds before commenting again.$/,
    replacement: 'Slow mode is on. Please wait up to %1% seconds before commenting again.',
  },
  HAS_MUTED_WORDS: {
    commentron: /^the comment contents are blocked by (.*)$/,
    replacement: 'The comment contains contents that are blocked by %1%.',
  },
  BLOCKED_BY_CREATOR: {
    commentron: 'channel is blocked by publisher',
    replacement: 'Unable to comment. This channel has blocked you.',
  },
  BLOCKED_BY_ADMIN: {
    commentron: 'channel is not allowed to post comments',
    replacement: 'Unable to comment. Your channel has been blocked by an admin.',
  },
  CREATOR_DISABLED: {
    commentron: 'comments are disabled by the creator',
    replacement: 'Unable to comment. The content owner has disabled comments.',
  },
  STOP_SPAMMING: {
    commentron: 'duplicate comment!',
    replacement: 'Please do not spam.',
  },
  CHANNEL_AGE: {
    commentron: 'this creator has set minimum account age requirements that are not currently met',
    replacement: "Your channel does not meet the creator's minimum channel-age limit.",
  },
};

export function resolveCommentronError(commentronMsg: string) {
  for (const key in ERR_MAP) {
    // noinspection JSUnfilteredForInLoop
    const data = ERR_MAP[key];
    if (typeof data.commentron === 'string') {
      if (data.commentron === commentronMsg) {
        return {
          message: __(data.replacement),
          linkText: data.linkText ? __(data.linkText) : undefined,
          linkTarget: data.linkTarget,
          isError: true,
        };
      }
    } else {
      const match = commentronMsg.match(data.commentron);
      if (match) {
        const subs = {};
        for (let i = 1; i < match.length; ++i) {
          subs[`${i}`] = match[i];
        }

        return {
          message: __(data.replacement, subs),
          linkText: data.linkText ? __(data.linkText) : undefined,
          linkTarget: data.linkTarget,
          isError: true,
        };
      }
    }
  }

  return {
    // Fallback to commentron original message. It will be in English
    // only and most likely not capitalized correctly.
    message: commentronMsg,
    isError: true,
  };
}
