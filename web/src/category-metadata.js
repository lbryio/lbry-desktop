const PAGES = require('../../ui/constants/pages');

// Uncomment as you add metadata

module.exports.CATEGORY_METADATA = {
  [PAGES.CREATIVE_ARTS]: () => ({
    title: 'The Arts',
    description: `Odysee's home for art, animation, comedy, and everything inbetween`,
    image: '',
  }),
  [PAGES.EDUCATION]: () => ({
    title: 'Education',
    description: `Who needs school when there's Odysee?`,
    image: '',
  }),
  [PAGES.FEATURED]: () => ({
    title: 'Featured',
    description: 'Showcasing some of the best content Odysee has to offer',
    image: '',
  }),
  [PAGES.FINANCE]: () => ({
    title: 'Finance 2.0',
    description: 'Crypto, Money, Economics, Markets on Odysee',
    image: 'https://player.odycdn.com/speech/category-finance:c.jpg',
  }),
  [PAGES.GAMING]: () => ({
    title: 'Gaming',
    description: 'Pew pew bzzz gaming on Odysee',
    image: 'https://player.odycdn.com/speech/category-gaming:5.jpg',
  }),
  [PAGES.GENERAL]: () => ({
    title: 'Cheese',
    description: 'Cheese is the answer to life, the universe, and everything. We have primo cheese on Odysee',
    image: 'https://player.odycdn.com/speech/category-primary1:5.jpg',
  }),
  [PAGES.LAB]: () => ({
    title: 'Lab',
    description: 'Science - the real kind, on Odysee',
    image: '',
  }),
  [PAGES.NEWS]: () => ({
    title: 'News & Politics',
    description: `Stay up to date with all that's happening around the world on Odysee`,
    image: '',
  }),
  [PAGES.MOVIES]: () => ({
    title: 'Movies',
    description: `Do you love B rated movies? We've got you covered on Odysee`,
    image: 'https://player.odycdn.com/speech/category-movies:2.jpg',
  }),
  [PAGES.MUSIC]: () => ({
    title: 'Music',
    description: 'Get your groove on with Odysee',
    image: 'https://player.odycdn.com/speech/category-music:8.jpg',
  }),
  [PAGES.POP_CULTURE]: () => ({
    title: 'Big Hits',
    description: 'Animation, pop culture, comedy, and all the other weird on Odysee',
    image: '',
  }),
  [PAGES.SEARCH]: ({ q = '' }) => {
    if (!q) {
      return {};
    }

    return {
      title: `"${q}" Search Results`,
      description: `Find the best "${q}" content on Odysee`,
      urlQueryString: `q=${q}`,
    };
  },
  [PAGES.TECH]: () => ({
    title: 'Tech',
    description: 'Hardware, software, startups, photography on Odysee',
    image: '',
  }),
  [PAGES.UNIVERSE]: () => ({
    title: 'Universe',
    description: 'Podcasts, life, learning, and everything else on Odysee',
    image: '',
  }),
  [PAGES.WILD_WEST]: () => ({
    title: 'Wild West',
    description: 'Boosted by user credits, this is what the community promotes on Odysee',
    image: 'https://player.odycdn.com/speech/category-wildwest:1.jpg',
  }),
};
