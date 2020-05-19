// @flow
import * as PAGES from 'constants/pages';
import * as ICONS from 'constants/icons';
import React from 'react';
import { withRouter } from 'react-router';
import Button from 'component/button';
import Tag from 'component/tag';
import StickyBox from 'react-sticky-box/dist/esnext';
import Spinner from 'component/spinner';
import usePersistedState from 'effects/use-persisted-state';
import classnames from 'classnames';
// @if TARGET='web'
// import Ads from 'lbrytv/component/ads';
// @endif

const SHOW_CHANNELS = 'SHOW_CHANNELS';
const SHOW_TAGS = 'SHOW_TAGS';

type Props = {
  subscriptions: Array<Subscription>,
  followedTags: Array<Tag>,
  email: ?string,
  uploadCount: number,
  sticky: boolean,
  expanded: boolean,
  doSignOut: () => void,
  location: { pathname: string },
  purchaseSuccess: boolean,
  doClearPurchasedUriSuccess: () => void,
};

function SideNavigation(props: Props) {
  const {
    subscriptions,
    followedTags,
    uploadCount,
    doSignOut,
    email,
    sticky = true,
    expanded = false,
    location,
    purchaseSuccess,
    doClearPurchasedUriSuccess,
  } = props;
  const { pathname } = location;
  const isAuthenticated = Boolean(email);
  const [pulseLibrary, setPulseLibrary] = React.useState(false);
  const [sideInformation, setSideInformation] = usePersistedState(
    'side-navigation:information',
    getSideInformation(pathname)
  );

  const isPersonalized = !IS_WEB || isAuthenticated;
  const requireAuthOnPersonalizedActions = IS_WEB;

  function getSideInformation(path) {
    switch (path) {
      case `/$/${PAGES.CHANNELS_FOLLOWING}`:
        return SHOW_CHANNELS;

      case `/$/${PAGES.TAGS_FOLLOWING}`:
        return SHOW_TAGS;

      default:
        return sideInformation;
    }
  }

  React.useEffect(() => {
    const sideInfo = getSideInformation(pathname);
    setSideInformation(sideInfo);
  }, [pathname, setSideInformation]);

  React.useEffect(() => {
    if (purchaseSuccess) {
      setPulseLibrary(true);

      let timeout = setTimeout(() => {
        setPulseLibrary(false);
        doClearPurchasedUriSuccess();
      }, 2500);

      return () => clearTimeout(timeout);
    }
  }, [setPulseLibrary, purchaseSuccess, doClearPurchasedUriSuccess]);

  function buildLink(path, label, icon, onClick, requiresAuth = false) {
    return {
      navigate: path ? `$/${path}` : '/',
      label,
      icon,
      onClick,
      requiresAuth,
    };
  }

  const Wrapper = ({ children }: any) =>
    sticky ? (
      <StickyBox offsetTop={100} offsetBottom={20}>
        {children}
      </StickyBox>
    ) : (
      <div>{children}</div>
    );

  return (
    <Wrapper>
      <nav className="navigation">
        <ul className="navigation-links">
          {[
            {
              ...(expanded && !isAuthenticated ? { ...buildLink(PAGES.AUTH, __('Sign Up'), ICONS.SIGN_UP) } : {}),
            },
            {
              ...(expanded && !isAuthenticated
                ? { ...buildLink(PAGES.AUTH_SIGNIN, __('Sign In'), ICONS.SIGN_IN) }
                : {}),
            },
            {
              ...buildLink(null, __('Home'), ICONS.HOME),
            },
            {
              ...buildLink(
                PAGES.CHANNELS_FOLLOWING,
                __('Following'),
                ICONS.SUBSCRIBE,
                null,
                requireAuthOnPersonalizedActions
              ),
            },
            {
              ...buildLink(PAGES.TAGS_FOLLOWING, __('Your Tags'), ICONS.TAG, null, requireAuthOnPersonalizedActions),
            },
            {
              ...buildLink(PAGES.DISCOVER, __('All Content'), ICONS.DISCOVER),
            },
            {
              ...buildLink(PAGES.LIBRARY, __('Library'), ICONS.LIBRARY),
            },
            {
              ...(expanded ? { ...buildLink(PAGES.SETTINGS, __('Settings'), ICONS.SETTINGS) } : {}),
            },
          ].map(
            linkProps =>
              linkProps.navigate && (
                <li key={linkProps.navigate}>
                  <Button
                    {...linkProps}
                    icon={pulseLibrary && linkProps.icon === ICONS.LIBRARY ? ICONS.PURCHASED : linkProps.icon}
                    className={classnames('navigation-link', {
                      'navigation-link--pulse': linkProps.icon === ICONS.LIBRARY && pulseLibrary,
                    })}
                    activeClass="navigation-link--active"
                  />
                </li>
              )
          )}

          {expanded &&
            isPersonalized &&
            [
              {
                ...buildLink(PAGES.CHANNELS, __('Channels'), ICONS.CHANNEL),
              },
              {
                ...buildLink(
                  PAGES.PUBLISHED,
                  uploadCount ? (
                    <span>
                      {__('Publishes')}
                      <Spinner type="small" />
                    </span>
                  ) : (
                    __('Publishes')
                  ),
                  ICONS.PUBLISH
                ),
              },
              {
                ...buildLink(PAGES.CREATOR_DASHBOARD, __('Creator Analytics'), ICONS.ANALYTICS),
              },
              {
                ...buildLink(PAGES.WALLET, __('Wallet'), ICONS.WALLET),
              },
              {
                ...buildLink(PAGES.REWARDS, __('Rewards'), ICONS.REWARDS),
              },
              {
                ...buildLink(PAGES.INVITE, __('Invites'), ICONS.INVITE),
              },
              {
                ...buildLink(PAGES.PUBLISH, __('Publish'), ICONS.PUBLISH),
              },
              {
                ...buildLink(PAGES.HELP, __('Help'), ICONS.HELP),
              },
              {
                ...(isAuthenticated ? { ...buildLink(PAGES.AUTH, __('Sign Out'), ICONS.SIGN_OUT, doSignOut) } : {}),
              },
            ].map(
              linkProps =>
                Object.keys(linkProps).length > 0 &&
                linkProps && (
                  <li key={linkProps.navigate}>
                    <Button {...linkProps} className="navigation-link" activeClass="navigation-link--active" />
                  </li>
                )
            )}
        </ul>

        {sideInformation === SHOW_TAGS && !expanded && isPersonalized && (
          <ul className="navigation__secondary navigation-links--small tags--vertical">
            {followedTags.map(({ name }, key) => (
              <li className="navigation-link__wrapper" key={name}>
                <Tag navigate={`/$/tags?t${name}`} name={name} />
              </li>
            ))}
          </ul>
        )}

        {sideInformation === SHOW_CHANNELS && !expanded && isPersonalized && (
          <ul className="navigation__secondary navigation-links--small">
            {subscriptions.map(({ uri, channelName }, index) => (
              <li key={uri} className="navigation-link__wrapper">
                <Button
                  navigate={uri}
                  label={channelName}
                  className="navigation-link"
                  activeClass="navigation-link--active"
                />
              </li>
            ))}
          </ul>
        )}
      </nav>
      // @if TARGET='web'
      {/* {!isAuthenticated && !expanded && <Ads />} commenting out sidebar ads for test */}
      // @endif
    </Wrapper>
  );
}

export default withRouter(SideNavigation);
