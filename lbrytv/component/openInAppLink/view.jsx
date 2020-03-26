// @flow
import React from 'react';
import { withRouter } from 'react-router';
import { formatWebUrlIntoLbryUrl } from 'util/url';
import Nag from 'component/common/nag';

const userAgent = navigator.userAgent.toLowerCase();
const isAndroidDevice = userAgent.includes('android');
const isDesktopDevice = typeof window.orientation === 'undefined';

type Props = {
  history: { replace: string => void, push: string => void },
  location: { search: string, pathname: string },
  uri: string,
  user: ?User,
};

function OpenInAppLink(props: Props) {
  const {
    history: { replace },
    location,
    uri,
    user,
  } = props;
  const [showNag, setShowNag] = React.useState(false);
  const { pathname, search } = location;
  let params = new URLSearchParams(search);
  const hasSrcParam = params.get('src');
  let isAndroidUser = false;
  let isDesktopUser = false;
  user &&
    user.device_types &&
    user.device_types.forEach(usedDevice => {
      if (usedDevice === 'mobile') {
        isAndroidUser = true;
      } else if (usedDevice === 'desktop') {
        isDesktopUser = true;
      }
    });

  const isWebUserOnly = !isAndroidUser && !isDesktopUser;

  let appLink = uri;
  if (!appLink) {
    appLink = formatWebUrlIntoLbryUrl(pathname, search);
  }

  function handleClose() {
    setShowNag(false);
  }

  React.useEffect(() => {
    if (hasSrcParam) {
      params.delete('src');
      const newParams = params.toString();
      const newUrl = `${pathname}?${newParams}`;
      replace(newUrl);
    }
  }, [hasSrcParam, search, pathname, replace]);

  React.useEffect(() => {
    if ((isAndroidUser && isAndroidDevice) || (isDesktopUser && isDesktopDevice)) {
      setShowNag(true);
    }
    // Don't pass showNag into this effect because we only want the initial value
    // If the param is removed from the url, the nag should still be shown
  }, [setShowNag, isAndroidUser, isDesktopUser]);

  if (!showNag || isWebUserOnly) {
    return null;
  }

  return (
    <Nag
      type="helpful"
      message={__('It looks like you may have LBRY %platform% installed.', {
        platform: isDesktopDevice ? __('Desktop') : __('Android'),
      })}
      actionText={__('Use the App')}
      href={appLink}
      onClose={handleClose}
    />
  );
}

export default withRouter(OpenInAppLink);
