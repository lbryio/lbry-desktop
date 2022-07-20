declare type Collection = {
  id: string,
  items: Array<?string>,
  name: string,
  description?: string,
  thumbnail?: {
    url?: string,
  },
  type: CollectionType,
  createdAt?: ?number,
  updatedAt: number,
  totalItems?: number,
  itemCount?: number,
  editsCleared?: boolean,
  sourceId?: string, // if copied, claimId of original collection
};

declare type CollectionType = 'playlist' | 'channelList' | 'collection'; // Must match COL_TYPES

declare type CollectionState = {
  unpublished: CollectionGroup,
  resolved: CollectionGroup,
  pending: CollectionGroup,
  edited: CollectionGroup,
  builtin: CollectionGroup,
  saved: Array<string>,
  isResolvingCollectionById: { [string]: boolean },
  error?: string | null,
  queue: Collection,
};

declare type CollectionGroup = {
  [string]: Collection,
};

declare type CollectionList = Array<Collection>;

declare type CollectionCreateParams = {
  name: string,
  description?: string,
  thumbnail?: {
    url?: string,
  },
  items: ?Array<string>,
  type: CollectionType,
  sourceId?: string, // if copied, claimId of original collection
};

declare type CollectionEditParams = {
  uris?: Array<string>,
  remove?: boolean,
  replace?: boolean,
  order?: { from: number, to: number },
  type?: CollectionType,
  name?: string,
  description?: string,
  thumbnail?: {
    url?: string,
  },
};

declare type CollectionFetchParams = {
  collectionId: string,
  pageSize?: number,
};
