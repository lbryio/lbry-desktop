export const RULE = {
  COMMENT: 'comment',
  COMMENT_REPLY: 'comment-reply',
  CREATOR_COMMENT: 'creator_comment',
  FIAT_TIP: 'fiat_tip',
  NEW_CONTENT: 'new_content',
  NEW_LIVESTREAM: 'new_livestream',
  NEW_MEMBER: 'new_member',
  WEEKLY_WATCH_REMINDER: 'weekly_watch_reminder',
  DAILY_WATCH_AVAILABLE: 'daily_watch_available',
  DAILY_WATCH_REMIND: 'daily_watch_remind',
  MISSED_OUT: 'missed_out',
  REWARDS_APPROVAL_PROMPT: 'rewards_approval_prompt',
  CREATOR_SUBSCRIBER: 'creator_subscriber',
};

export const NOTIFICATION_NAME_ALL = 'All';

// -- Regex that matches a channel name "@something" when at the beginning of the sentence
export const CHANNEL_NAME_AT_SENTENCE_START_REGEX = /^@\w+/gm;

// -- Regex that matches a membership name after a ": " at the end of the sentence
export const MEMBERSHIP_NAME_AT_SENTENCE_END_REGEX = /: .+$/gm;
