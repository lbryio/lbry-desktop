// @flow
import { MATURE_TAGS, MEMBERS_ONLY_CONTENT_TAG } from 'constants/tags';

/**
 * Helper functions to derive the ClaimSearch option payload.
 */
export const CsOptions = {
  not_tags: (notTags: ?Array<string>, showNsfw: ?boolean, hideMembersOnlyContent: ?boolean) => {
    const not_tags = !showNsfw ? MATURE_TAGS.slice() : [];
    if (notTags) {
      not_tags.push(...notTags);
    }
    if (hideMembersOnlyContent) {
      not_tags.push(MEMBERS_ONLY_CONTENT_TAG);
    }
    return not_tags;
  },
};
