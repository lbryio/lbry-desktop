// @flow
import * as STRIPE from 'constants/stripe';

export const ODYSEE_TIER_NAMES = Object.freeze({ PREMIUM: 'Premium', PREMIUM_PLUS: 'Premium+' });

export const DESCRIPTIONS = Object.freeze({
  [ODYSEE_TIER_NAMES.PREMIUM]: 'Badge on profile, automatic rewards confirmation, and early access to new features',
  [ODYSEE_TIER_NAMES.PREMIUM_PLUS]:
    'Badge on profile, automatic rewards confirmation, early access to new features, and no ads',
});

export const INTERVALS = Object.freeze({ year: 'Yearly', month: 'Monthly' });

export const PRICES = Object.freeze({
  [ODYSEE_TIER_NAMES.PREMIUM]: { [STRIPE.CURRENCIES.EUR]: '€0.89', [STRIPE.CURRENCIES.USD]: '99¢' },
  [ODYSEE_TIER_NAMES.PREMIUM_PLUS]: { [STRIPE.CURRENCIES.EUR]: '€2.68', [STRIPE.CURRENCIES.USD]: '$2.99' },
});

export const ODYSEE_PERKS = Object.freeze({
  MEMBER_BADGE: {
    id: 4,
    name: 'Member badge',
    description: 'Badge shown in chat',
  },
  PROTECTED_CONTENT: {
    id: 5,
    name: 'Exclusive content',
    description: 'Access to members-only content and chat',
  },
  PROTECTED_LIVESTREAM: {
    id: 6,
    name: 'Exclusive livestreams',
    description: 'Access to members-only livestreams and chat',
  },
  MEMBERS_ONLY_CHAT: {
    id: 7,
    name: 'Members-only chat',
    description: 'Access to members-only chat on public content',
  },
});

export const PERMANENT_TIER_PERKS = [ODYSEE_PERKS.MEMBER_BADGE.id];
