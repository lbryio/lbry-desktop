const path = require('path');
const memo = {};

const loadAnnouncements = (homepageKeys) => {
  const fs = require('fs');
  const announcements = {};

  homepageKeys.forEach((key) => {
    const file = path.join(__dirname, `../dist/announcement/${key.toLowerCase()}.md`);
    let announcement;
    try {
      announcement = fs.readFileSync(file, 'utf8');
    } catch {}
    announcements[key] = announcement ? announcement.trim() : '';
  });

  return announcements;
};

// this didn't seem to help.
if (!memo.homepageData) {
  try {
    memo.homepageData = require('../../custom/homepages/v2');
    memo.announcements = loadAnnouncements(Object.keys(memo.homepageData));
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
    v2[hp] = {
      ...memo.homepageData[hp],
      announcement: memo.announcements[hp],
    };
  });
  return v2;
};

module.exports = { getHomepageJsonV1, getHomepageJsonV2 };
