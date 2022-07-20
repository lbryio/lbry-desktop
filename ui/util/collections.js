// @flow
import { COL_TYPES } from 'constants/collections';

export const selectCountForCollection = (collection: Collection) => {
  if (collection) {
    if (collection.itemCount !== undefined) {
      return collection.itemCount;
    }

    let itemCount = 0;
    if (collection.items) {
      collection.items.forEach((item) => {
        if (item) {
          itemCount += 1;
        }
      });
    }
    return itemCount;
  }

  return null;
};

/**
 * Determines the overall type for a particular collection.
 *
 * Pass in the set of `claim::value_type` and `claim::stream_type` for all
 * entries in that collection.
 *
 * 'collection', I believe, is the placeholder for mixed-type collection.
 *
 * @param valueTypes
 * @param streamTypes
 * @returns {string}
 */
export function resolveCollectionType(valueTypes: Set<string>, streamTypes: Set<string>): CollectionType {
  if (
    valueTypes.size === 1 &&
    valueTypes.has('stream') &&
    ((streamTypes.size === 1 && (streamTypes.has('audio') || streamTypes.has('video'))) ||
      (streamTypes.size === 2 && streamTypes.has('audio') && streamTypes.has('video')))
  ) {
    return COL_TYPES.PLAYLIST;
  }

  return COL_TYPES.COLLECTION;
}
