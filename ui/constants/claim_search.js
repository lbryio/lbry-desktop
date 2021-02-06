export const PAGE_SIZE = 20;

export const FRESH_KEY = 'fresh';
export const ORDER_BY_KEY = 'order';
export const DURATION_KEY = 'duration';
export const LANGUAGE_KEY = 'language';
export const TAGS_KEY = 't';
export const CONTENT_KEY = 'content';
export const REPOSTED_URI_KEY = 'reposted_uri';
export const CHANNEL_IDS_KEY = 'channel_ids';
export const TAGS_ALL = 'tags_any';
export const TAGS_FOLLOWED = 'tags_followed';

export const FEE_AMOUNT_KEY = 'fee_amount';
export const FEE_AMOUNT_ANY = '>=0';
export const FEE_AMOUNT_ONLY_PAID = '>0';
export const FEE_AMOUNT_ONLY_FREE = '<=0';

export const LANGUAGES_ALL = 'all';

export const FRESH_DAY = 'day';
export const FRESH_WEEK = 'week';
export const FRESH_MONTH = 'month';
export const FRESH_YEAR = 'year';
export const FRESH_ALL = 'all';
export const FRESH_DEFAULT = 'default';
export const FRESH_TYPES = [FRESH_DEFAULT, FRESH_DAY, FRESH_WEEK, FRESH_MONTH, FRESH_YEAR, FRESH_ALL];

export const ORDER_BY_TRENDING = 'trending';
export const ORDER_BY_TRENDING_VALUE = ['trending_group', 'trending_mixed'];
export const ORDER_BY_TOP = 'top';
export const ORDER_BY_TOP_VALUE = ['effective_amount'];
export const ORDER_BY_NEW = 'new';
export const ORDER_BY_NEW_VALUE = ['release_time'];
export const ORDER_BY_TYPES = [ORDER_BY_TRENDING, ORDER_BY_NEW, ORDER_BY_TOP];

export const DURATION_SHORT = 'short';
export const DURATION_LONG = 'long';
export const DURATION_ALL = 'all';
export const DURATION_TYPES = [DURATION_ALL, DURATION_SHORT, DURATION_LONG];

export const FILE_VIDEO = 'video';
export const FILE_AUDIO = 'audio';
export const FILE_DOCUMENT = 'document';
export const FILE_BINARY = 'binary';
export const FILE_IMAGE = 'image';
export const FILE_MODEL = 'model';
export const FILE_TYPES = [FILE_VIDEO, FILE_AUDIO, FILE_DOCUMENT, FILE_IMAGE, FILE_MODEL, FILE_BINARY];

export const CLAIM_TYPE = 'claim_type';
export const CLAIM_CHANNEL = 'channel';
export const CLAIM_STREAM = 'stream';
export const CLAIM_REPOST = 'repost';
export const CLAIM_COLLECTION = 'collection';
export const CLAIM_TYPES = [CLAIM_CHANNEL, CLAIM_REPOST, CLAIM_STREAM, CLAIM_COLLECTION];

export const CONTENT_ALL = 'all';
export const CONTENT_TYPES = [CONTENT_ALL, CLAIM_CHANNEL, CLAIM_REPOST, CLAIM_COLLECTION, ...FILE_TYPES];
export const KEYS = [ORDER_BY_KEY, TAGS_KEY, FRESH_KEY, CONTENT_KEY, DURATION_KEY];
