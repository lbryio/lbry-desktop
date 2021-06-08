// @flow
import React from 'react';
import { withRouter } from 'react-router';
import { formatWebUrlIntoLbryUrl } from 'util/url';
import Nag from 'component/common/nag';
import usePersistedState from 'effects/use-persisted-state';

const userAgent = navigator.userAgent.toLowerCase();
const isAndroidDevice = userAgent.includes('android');
const isDesktopDevice = typeof window.orientation === 'undefined';
const addDaysToMs = (initialNumberInMs: number, daysToAdd: number) => {
  return initialNumberInMs + daysToAdd * 1000 * 60 * 60 * 24;
};

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
  const [closeNagClicksCount, setCloseNagClicksCount] = usePersistedState('open-in-app-close-count', 0);
  const [closeNagLastDate, setCloseNagLastDate] = usePersistedState('open-in-app-close-date', 0);
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
    setCloseNagClicksCount(closeNagClicksCount + 1);
    setCloseNagLastDate(Date.now());
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
    const isOnDeviceToPrompt = (isAndroidUser && isAndroidDevice) || (isDesktopUser && isDesktopDevice);
    const dateRightNow = Date.now();
    const daysToAddToDate = Math.min(30, Math.pow(2, closeNagClicksCount));
    const startDateForAnotherOpenNag = closeNagLastDate + addDaysToMs(closeNagLastDate, daysToAddToDate);
    const hasWaitedEnoughTime = dateRightNow > startDateForAnotherOpenNag;

    if (isOnDeviceToPrompt && hasWaitedEnoughTime) {
      setShowNag(true);
    }
    // Don't pass showNag into this effect because we only want the initial value
    // If the param is removed from the url, the nag should still be shown
  }, [setShowNag, isAndroidUser, isDesktopUser, closeNagLastDate, closeNagClicksCount]);

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
