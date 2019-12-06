exports.formatLbryUrlForWeb = uri => {
  return uri.replace('lbry://', '/').replace(/#/g, ':');
};

exports.formatFileSystemPath = path => {
  if (!path) {
    return;
  }

  let webUrl = path.replace(/\\/g, '/');

  if (webUrl[0] !== '/') {
    webUrl = `/${webUrl}`;
  }

  return encodeURI(`file://${webUrl}`).replace(/[?#]/g, encodeURIComponent);
};

/*
  Function that handles page redirects
  ex: lbry://?rewards
  ex: open.lbry.com/?rewards
*/
exports.formatInAppUrl = path => {
  // Determine if we need to add a leading "/$/" for app pages
  const APP_PAGE_REGEX = /(\?)([a-z]*)(.*)/;
  const appPageMatches = APP_PAGE_REGEX.exec(path);

  if (appPageMatches && appPageMatches.length) {
    // Definitely an app page (or it's formatted like one)
    const [, , page, queryString] = appPageMatches;
    let actualUrl = '/$/' + page;

    if (queryString) {
      actualUrl += `?${queryString.slice(1)}`;
    }

    return actualUrl;
  }

  // Regular claim url
  return path;
};
