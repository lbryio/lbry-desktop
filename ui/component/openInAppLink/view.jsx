// @flow
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import React from 'react';
import Button from 'component/button';
import { withRouter } from 'react-router';
import userPersistedState from 'effects/use-persisted-state';

const userAgent = navigator.userAgent.toLowerCase();
const isAndroid = userAgent.includes('android');
const isDesktop = typeof window.orientation === 'undefined';

type Props = {
  history: { replace: string => void },
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
    user && !user.device_types.some(usedDevice => usedDevice === 'mobile' || usedDevice === 'desktop');
  const [hideNagForGood, setHideNagForGood] = userPersistedState('open-in-app-nag', false);
  const [showNag, setShowNag] = React.useState(initialShouldShowNag);
  let appLink = uri;

  if (!appLink) {
    // If there is no uri, the user is on an internal page
    // pathname will either be "/" or "/$/{page}"
    const path = pathname.startsWith('/$/') ? pathname.slice(3) : pathname.slice(1);
    appLink = `lbry://?${path || PAGES.DISCOVER}`;

    if (search) {
      // We already have a leading "?" for the query param on internal pages
      appLink += search.replace('?', '&');
    }
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
    <div className="nag">
      {__('The app is like, better.')}
      <Button className="nag__button" href={appLink}>
        {__('Use The App')}
      </Button>
      <Button className="nag__button nag__close" icon={ICONS.REMOVE} onClick={handleClose} />
    </div>
  );
}

export default withRouter(OpenInAppLink);
