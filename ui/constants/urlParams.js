export const FYP_ID = 'fypId';

export const CHANNEL_PAGE = Object.freeze({
  QUERIES: { VIEW: 'view' },
  VIEWS: {
    CONTENT: 'content',
    LISTS: 'lists',
    CHANNELS: 'channels',
    MEMBERSHIP: 'membership',
    DISCUSSION: 'discussion',
    ABOUT: 'about',
    EDIT: 'edit',
  },
});

export const COLLECTION_PAGE = Object.freeze({
  QUERIES: {
    VIEW: 'view',
    TYPE: 'type',
  },
  VIEWS: {
    EDIT: 'edit',
    PUBLISH: 'publish',
  },
  TYPES: {
    FEATURED: 'featuredChannels',
  },
});

export const CHANNEL_SECTIONS_QUERIES = Object.freeze({
  CLAIM_ID: 'claimId',
  SECTION_ID: 'sectionId',
});
