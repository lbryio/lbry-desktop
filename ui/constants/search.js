export const FILE = 'file';
export const CHANNEL = 'channel';
export const SEARCH = 'search';
export const DEBOUNCE_WAIT_DURATION_MS = 250;

export const SEARCH_TYPES = {
  FILE: 'file',
  CHANNEL: 'channel',
  SEARCH: 'search',
  TAG: 'tag',
};

export const SEARCH_OPTIONS = {
  RESULT_COUNT: 'size',
  CLAIM_TYPE: 'claimType',
  RELATED_TO: 'related_to',
  INCLUDE_FILES: 'file',
  INCLUDE_CHANNELS: 'channel',
  INCLUDE_FILES_AND_CHANNELS: 'file,channel',
  INCLUDE_MATURE: 'nsfw',
  MEDIA_AUDIO: 'audio',
  MEDIA_VIDEO: 'video',
  MEDIA_TEXT: 'text',
  MEDIA_IMAGE: 'image',
  MEDIA_APPLICATION: 'application',
  SORT: 'sort_by',
  SORT_ACCENDING: '^release_time',
  SORT_DESCENDING: 'release_time',
  EXACT: 'exact',
  PRICE_FILTER_FREE: 'free_only',
  TIME_FILTER: 'time_filter',
  TIME_FILTER_LAST_HOUR: 'lasthour',
  TIME_FILTER_TODAY: 'today',
  TIME_FILTER_THIS_WEEK: 'thisweek',
  TIME_FILTER_THIS_MONTH: 'thismonth',
  TIME_FILTER_THIS_YEAR: 'thisyear',
  CHANNEL_ID: 'channel_id',
};

export const SEARCH_PAGE_SIZE = 20;
