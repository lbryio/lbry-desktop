// @flow
import React from 'react';
import { withRouter } from 'react-router';
import userPersistedState from 'effects/use-persisted-state';
import { formatWebUrlIntoLbryUrl } from 'util/url';
import Nag from 'component/common/nag';

const userAgent = navigator.userAgent.toLowerCase();
const isAndroid = userAgent.includes('android');
const isDesktop = typeof window.orientation === 'undefined';

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
  const { pathname, search } = location;
  let params = new URLSearchParams(search);
  const hasSrcParam = params.get('src');
  const initialShouldShowNag = hasSrcParam && (isAndroid || isDesktop);
  const isWebUserOnly =
    user &&
    user.device_types &&
    !user.device_types.some(usedDevice => usedDevice === 'mobile' || usedDevice === 'desktop');
  const [hideNagForGood, setHideNagForGood] = userPersistedState('open-in-app-nag', false);
  const [showNag, setShowNag] = React.useState(initialShouldShowNag);
  let appLink = uri;

  if (!appLink) {
    appLink = formatWebUrlIntoLbryUrl(pathname, search);
  }

  function handleClose() {
    if (!isWebUserOnly) {
      setHideNagForGood(true);
    }

    setShowNag(false);
  }

  React.useEffect(() => {
    if (hasSrcParam) {
      params.delete('src');
      const newParams = params.toString();
      const newUrl = `${pathname}?${newParams}`;
      replace(newUrl);
    }
  }, [search, pathname, replace]);

  if (!showNag || hideNagForGood) {
    return null;
  }

  return (
    <Nag message={__('Want even more freedom?')} actionText={__('Use the App')} href={appLink} onClose={handleClose} />
  );
}

export default withRouter(OpenInAppLink);
