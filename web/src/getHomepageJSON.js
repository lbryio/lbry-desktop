const memo = {};

// this didn't seem to help.
if (!memo.homepageData) {
  try {
    memo.homepageData = require('../../custom/homepages/v2');
  } catch (err) {
    console.log('getHomepageJSON:', err);
  }
}

const getHomepageJsonV1 = () => {
  if (!memo.homepageData) {
    return {};
  }

  const v1 = {};
  const homepageKeys = Object.keys(memo.homepageData);
  homepageKeys.forEach((hp) => {
    v1[hp] = memo.homepageData[hp].categories;
  });
  return v1;
};

const getHomepageJsonV2 = () => {
  if (!memo.homepageData) {
    return {};
  }

  const v2 = {};
  const homepageKeys = Object.keys(memo.homepageData);
  homepageKeys.forEach((hp) => {
    v2[hp] = memo.homepageData[hp];
  });
  return v2;
};

module.exports = { getHomepageJsonV1, getHomepageJsonV2 };
