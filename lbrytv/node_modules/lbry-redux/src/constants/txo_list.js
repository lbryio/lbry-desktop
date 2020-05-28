export const ACTIVE = 'active'; // spent, active, all
export const TYPE = 'type'; // all, payment, support, channel, stream, repost
export const SUB_TYPE = 'subtype'; // other, purchase, tip
export const PAGE_SIZE = 'page_size';
export const PAGE = 'page';
export const ALL = 'all';
// dropdown types
export const SENT = 'sent';
export const RECEIVED = 'received';
export const SUPPORT = 'support';
export const CHANNEL = 'channel';
export const PUBLISH = 'publish';
export const REPOST = 'repost';
export const DROPDOWN_TYPES = [ALL, SENT, RECEIVED, SUPPORT, CHANNEL, PUBLISH, REPOST];
// dropdown subtypes
export const TIP = 'tip';
export const PURCHASE = 'purchase';
export const PAYMENT = 'payment';
export const DROPDOWN_SUBTYPES = [ALL, TIP, PURCHASE, PAYMENT];

// rpc params
export const TX_TYPE = 'type'; // = other, stream, repost, channel, support, purchase
export const IS_SPENT = 'is_spent';
export const IS_NOT_SPENT = 'is_not_spent';
export const IS_MY_INPUT = 'is_my_input';
export const IS_MY_OUTPUT = 'is_my_output';
export const IS_NOT_MY_INPUT = 'is_not_my_input';
export const IS_NOT_MY_OUTPUT = 'is_not_my_output'; // use to further distinguish payments to self / from self.
export const IS_MY_INPUT_OR_OUTPUT = 'is_my_input_or_output';
export const EXCLUDE_INTERNAL_TRANSFERS = 'exclude_internal_transfers';

// sdk unique types
export const OTHER = 'other';
export const STREAM = 'stream';

export const PAGE_SIZE_DEFAULT = 20;
