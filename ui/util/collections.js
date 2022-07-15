// @flow

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
