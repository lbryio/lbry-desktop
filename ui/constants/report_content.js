// Sample query:
//   https://reports.odysee.tv/common/new?primary_email=e4drcf@gmail.com
//     &channel_name=e4drcf
//     &channel_claim_id=43a7e08b0d83cfb8bc31e59bc48334a90ccfd8cb
//     &type=Sexual%20content
//     &category=Nudity
//     &claim_id=43a7e08b0d83cfb8bc31e59bc48334a90ccfd8cb
//     &transaction_id=297b3f7a3d17d2a59aed73491934d453091602215c3128337d1859aa18a18d3e
//     &vout=1
//     &timestamp=12:03
//     &additional_details=Hello%20Rick!

export const CATEGORIES = 'categories';
export const INFRINGES_MY_RIGHTS = 'Infringes my rights';
export const COPYRIGHT_ISSUES = 'Copyright issue';
export const OTHER_LEGAL_ISSUES = 'Other legal issue';
export const BEHALF_SELF = 'self';
export const BEHALF_CLIENT = 'client';
export const PARTY_SELF = 'Myself';
export const PARTY_GROUP = 'My company, organization, or client';

export const RELATIONSHIP_FIELD_MIN_WIDTH = 10;
export const COPYRIGHT_OWNER_MAX_LENGTH = 50;

export const PARAMETERS = {
  type: {
    'Sexual content': {
      [CATEGORIES]: [
        'Graphic sexual activity',
        'Nudity',
        'Suggestive, but without nudity',
        'Content involving minors',
        'Sexual Abusive title or description',
        'Other sexual content',
      ],
    },
    'Violent or repulsive content': {
      [CATEGORIES]: ['Adults fighting', 'Physical attack', 'Youth violence', 'Animal abuse'],
    },
    'Hateful or abusive content': {
      [CATEGORIES]: ['Promotes hatred or violence', 'Bullying', 'Hateful Abusive title or description'],
    },
    'Harmful or dangerous acts': {
      [CATEGORIES]: [
        'Pharmaceutical or drug abuse',
        'Abuse of fire or explosives',
        'Suicide or self injury',
        'Other dangerous acts',
      ],
    },
    'Child abuse': {
      [CATEGORIES]: ['Child abuse'],
    },
    'Promotes terrorism': {
      [CATEGORIES]: ['Promotes terrorism'],
    },
    'Spam or misleading': {
      [CATEGORIES]: [
        'Mass advertising',
        'Pharmaceutical drugs for sale',
        'Misleading text',
        'Misleading thumbnail',
        'Scams or fraud',
      ],
    },
    [INFRINGES_MY_RIGHTS]: {
      [CATEGORIES]: [COPYRIGHT_ISSUES, OTHER_LEGAL_ISSUES],
    },
    // CAPTIONS_ISSUE: 'Captions issue',
  },
};
