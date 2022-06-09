const path = require('path');
const memo = {};

const FORMAT = { ROKU: 'roku' };

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
  if (process.env.CUSTOM_HOMEPAGE !== 'true') {
    return;
  }

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

const reformatV2Categories = (categories, format) => {
  if (format === FORMAT.ROKU) {
    return categories && Object.entries(categories).map(([key, value]) => value);
  } else {
    return categories;
  }
};

const getHomepageJsonV2 = (format) => {
  if (!memo.homepageData) {
    return {};
  }

  const v2 = {};
  const homepageKeys = Object.keys(memo.homepageData);
  homepageKeys.forEach((hp) => {
    v2[hp] = {
      categories: reformatV2Categories(memo.homepageData[hp].categories, format),
      meme: memo.homepageData[hp].meme,
      announcement: memo.announcements[hp],
    };
  });
  return v2;
};

module.exports = { getHomepageJsonV1, getHomepageJsonV2 };
