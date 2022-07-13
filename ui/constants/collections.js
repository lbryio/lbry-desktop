import * as ICONS from 'constants/icons';

// ui
export const ICON_SIZE = 12;
export const PLACEHOLDER = 'My Awesome Playlist';

// see which of these are used
export const COLLECTION_ID = 'lid';
export const COLLECTION_INDEX = 'linx';

export const COL_TYPE_PLAYLIST = 'playlist';
export const COL_TYPE_CHANNELS = 'channelList';

export const WATCH_LATER_ID = 'watchlater';
export const WATCH_LATER_NAME = 'Watch Later';

export const FAVORITES_ID = 'favorites';
export const FAVORITES_NAME = 'Favorites';

export const QUEUE_ID = 'queue';
export const QUEUE_NAME = 'Queue';

export const BUILTIN_PLAYLISTS = [WATCH_LATER_ID, FAVORITES_ID, QUEUE_ID];
// export const FAVORITE_CHANNELS_ID = 'favoriteChannels';
// export const BUILTIN_LISTS = [WATCH_LATER_ID, FAVORITES_ID, FAVORITE_CHANNELS_ID];

export const COL_KEY_BUILTIN = 'builtin';
export const COL_KEY_EDITED = 'edited';
export const COL_KEY_UNPUBLISHED = 'unpublished';
export const COL_KEY_PUBLISHED = 'published';
export const COL_KEY_PENDING = 'pending';

export const PLAYLIST_ICONS = {
  [FAVORITES_ID]: ICONS.STAR,
  [WATCH_LATER_ID]: ICONS.TIME,
  [QUEUE_ID]: ICONS.PLAYLIST,
};

export const LIST_TYPE = Object.freeze({ ALL: 'All', PRIVATE: 'Private', PUBLIC: 'Public' });
export const PLAYLIST_SHOW_COUNT = Object.freeze({ DEFAULT: 12, MOBILE: 6 });

export const SORT_ORDER = Object.freeze({
  ASC: 'asc', // ascending
  DESC: 'desc', // descending
});

export const SORT_KEYS = Object.freeze({
  NAME: 'name',
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
  COUNT: 'count',
});

export const SORT_VALUES = Object.freeze({
  [SORT_KEYS.NAME]: { str: 'Name', orders: { [SORT_ORDER.ASC]: 'A-Z', [SORT_ORDER.DESC]: 'Z-A' } },
  [SORT_KEYS.CREATED_AT]: {
    str: 'Creation Time',
    orders: { [SORT_ORDER.ASC]: 'Newest First', [SORT_ORDER.DESC]: 'Oldest First' },
  },
  [SORT_KEYS.UPDATED_AT]: {
    str: 'Updated Time',
    orders: { [SORT_ORDER.ASC]: 'Newest First', [SORT_ORDER.DESC]: 'Oldest First' },
  },
  [SORT_KEYS.COUNT]: {
    str: 'Video Count',
    orders: { [SORT_ORDER.ASC]: 'Increasing', [SORT_ORDER.DESC]: 'Decreasing' },
  },
});

export const DEFAULT_SORT = { key: 'name', value: SORT_ORDER.ASC };
