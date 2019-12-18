// @flow
import * as PAGES from 'constants/pages';
import * as ICONS from 'constants/icons';
import React from 'react';
import Button from 'component/button';
import Tag from 'component/tag';
import StickyBox from 'react-sticky-box/dist/esnext';
import Spinner from 'component/spinner';

type Props = {
  subscriptions: Array<Subscription>,
  followedTags: Array<Tag>,
  email: ?string,
  obscureSideBar: boolean,
  uploadCount: number,
  sticky: boolean,
  showAllLinks: boolean,
  doSignOut: () => void,
};

function SideBar(props: Props) {
  const {
    subscriptions,
    followedTags,
    obscureSideBar,
    uploadCount,
    doSignOut,
    email,
    sticky = true,
    showAllLinks = false,
  } = props;
  const isAuthenticated = Boolean(email);

  function buildLink(path, label, icon, onClick) {
    return {
      navigate: path ? `$/${path}` : '/',
      label,
      icon,
      onClick,
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

  return obscureSideBar ? (
    <Wrapper>
      <div className="card navigation--placeholder">
        <div className="wrap">
          <h2>LBRY</h2>
          <p>{__('The best decentralized content platform on the web.')}</p>
        </div>
      </div>
    </Wrapper>
  ) : (
    <Wrapper>
      <nav className="navigation">
        <ul className="navigation-links">
          {[
            {
              ...buildLink(null, __('Home'), ICONS.HOME),
            },
            // @if TARGET='app'
            {
              ...buildLink(PAGES.LIBRARY, __('Library'), ICONS.LIBRARY),
            },
            // @endif
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
          ].map(linkProps => (
            <li key={linkProps.navigate}>
              <Button {...linkProps} className="navigation-link" activeClass="navigation-link--active" />
            </li>
          ))}

          {showAllLinks &&
            [
              {
                ...buildLink(PAGES.WALLET, __('Wallet'), ICONS.WALLET),
              },
              {
                ...buildLink(PAGES.REWARDS, __('Rewards'), ICONS.FEATURED),
              },
              {
                ...buildLink(PAGES.ACCOUNT, __('Overview'), ICONS.OVERVIEW),
              },
              {
                ...buildLink(PAGES.PUBLISH, __('Publish'), ICONS.PUBLISH),
              },
              {
                ...buildLink(PAGES.SETTINGS, __('Settings'), ICONS.SETTINGS),
              },
              {
                ...buildLink(PAGES.HELP, __('Help'), ICONS.HELP),
              },
              {
                ...(isAuthenticated ? { ...buildLink(PAGES.AUTH, __('Sign Out'), ICONS.SIGN_OUT, doSignOut) } : {}),
              },
            ].map(linkProps => (
              <li key={linkProps.navigate}>
                <Button {...linkProps} className="navigation-link" activeClass="navigation-link--active" />
              </li>
            ))}

          <li>
            <Button
              navigate={`/$/${PAGES.FOLLOWING}`}
              label={__('Customize')}
              icon={ICONS.EDIT}
              className="navigation-link"
              activeClass="navigation-link--active"
            />
          </li>
        </ul>

        <section className="navigation-links__inline">
          <ul className="navigation-links--small tags--vertical">
            {followedTags.map(({ name }, key) => (
              <li className="navigation-link__wrapper" key={name}>
                <Tag navigate={`/$/tags?t${name}`} name={name} />
              </li>
            ))}
          </ul>
          <ul className="navigation-links--small">
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
        </section>
      </nav>
    </Wrapper>
  );
}

export default SideBar;
