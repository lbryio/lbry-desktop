type Collection = {
  id: string;
  items: Array<string | null | undefined>;
  name: string;
  type: string;
  updatedAt: number;
  totalItems?: number;
  sourceId?: string; // if copied, claimId of original collection
};

type CollectionState = {
  unpublished: CollectionGroup;
  resolved: CollectionGroup;
  pending: CollectionGroup;
  edited: CollectionGroup;
  builtin: CollectionGroup;
  saved: Array<string>;
  isResolvingCollectionById: { [key: string]: boolean };
  error?: string | null;
};

type CollectionGroup = {
  [key: string]: Collection;
};

type CollectionEditParams = {
  uris?: Array<string>;
  remove?: boolean;
  replace?: boolean;
  order?: { from: number; to: number };
  type?: string;
  name?: string;
};
