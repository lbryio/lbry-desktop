const memo = {};
// this didn't seem to help.
if (!memo.homepageData) {
  try {
    memo.homepageData = require('../../custom/homepages/v2');
  } catch (err) {
    console.log('homepage data failed');
  }
}
const getHomepageJSON = () => {
  return memo.homepageData || {};
};
module.exports = { getHomepageJSON };
