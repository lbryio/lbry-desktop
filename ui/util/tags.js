// @flow
import { INTERNAL_TAGS, PURCHASE_TAG, PURCHASE_TAG_OLD, RENTAL_TAG, RENTAL_TAG_OLD } from 'constants/tags';

export function removeInternalStringTags(tags: Array<string>): Array<string> {
  return tags.filter((tag: string) => {
    return (
      !INTERNAL_TAGS.includes(tag) &&
      !tag.startsWith(PURCHASE_TAG) &&
      !tag.startsWith(PURCHASE_TAG_OLD) &&
      !tag.startsWith(RENTAL_TAG) &&
      !tag.startsWith(RENTAL_TAG_OLD)
    );
  });
}

export function removeInternalTags(tags: Array<Tag>): Array<Tag> {
  return tags.filter((tag: Tag) => {
    return (
      !INTERNAL_TAGS.includes(tag.name) &&
      !tag.name.startsWith(PURCHASE_TAG) &&
      !tag.name.startsWith(PURCHASE_TAG_OLD) &&
      !tag.name.startsWith(RENTAL_TAG) &&
      !tag.name.startsWith(RENTAL_TAG_OLD)
    );
  });
}

export function hasFiatTags(claim: Claim) {
  const tags = claim.value?.tags;
  if (tags) {
    return tags.some(
      (t) =>
        t.includes(PURCHASE_TAG) ||
        t.startsWith(PURCHASE_TAG_OLD) ||
        t.includes(RENTAL_TAG) ||
        t.startsWith(RENTAL_TAG_OLD)
    );
  }
  return false;
}
