const memo = {};

// this didn't seem to help.
if (!memo.homepageData) {
  try {
    memo.homepageData = require('../../custom/homepages/v2');
    memo.meme = require('../../custom/homepages/meme');
  } catch (err) {
    console.log('getHomepageJSON:', err);
  }
}

const getHomepageJsonV1 = () => {
  return memo.homepageData || {};
};

const getHomepageJsonV2 = () => {
  if (!memo.homepageData) {
    return {};
  }

  const v2 = {};
  const homepageKeys = Object.keys(memo.homepageData);

  homepageKeys.forEach((hp) => {
    v2[hp] = {
      categories: memo.homepageData[hp],
    };
  });

  if (memo.meme && v2['en']) {
    // Only supporting English memes for now, but one-per-homepage is possible.
    v2['en'].meme = memo.meme;
  }

  return v2;
};

module.exports = { getHomepageJsonV1, getHomepageJsonV2 };
