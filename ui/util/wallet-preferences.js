export const makeMergedPrefs = (alt, base) => {
  let finalPrefs = base;
  let baseData = base.value;
  let altData = alt.value;
  if (!altData) {
    return base;
  }

  let mergedBlockListSet = new Set(baseData.blocked || []);
  let mergedSubscriptionsSet = new Set(baseData.subscriptions || []);
  let mergedTagsSet = new Set(baseData.tags || []);

  const altBlocklist = altData.blocked || [];
  const altSubscriptions = altData.subscriptions || [];
  const altTags = altData.tags || [];

  if (altBlocklist.length) {
    altBlocklist.forEach((el) => mergedBlockListSet.add(el));
  }
  if (altSubscriptions.length) {
    altSubscriptions.forEach((el) => mergedSubscriptionsSet.add(el));
  }
  if (altTags.length) {
    altTags.forEach((el) => mergedTagsSet.add(el));
  }

  baseData.blocked = Array.from(mergedBlockListSet);
  baseData.subscriptions = Array.from(mergedSubscriptionsSet);
  baseData.tags = Array.from(mergedTagsSet);
  finalPrefs.value = baseData;
  return finalPrefs;
};
