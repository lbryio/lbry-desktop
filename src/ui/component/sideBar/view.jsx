// @flow
import * as PAGES from 'constants/pages';
import * as ICONS from 'constants/icons';
import React from 'react';
import Button from 'component/button';
import Tag from 'component/tag';
import StickyBox from 'react-sticky-box/dist/esnext';
import 'css-doodle';
import Spinner from 'component/spinner';

type Props = {
  subscriptions: Array<Subscription>,
  followedTags: Array<Tag>,
  email: ?string,
  obscureSideBar: boolean,
  uploadCount: number,
};

function SideBar(props: Props) {
  const { subscriptions, followedTags, obscureSideBar, uploadCount } = props;
  function buildLink(path, label, icon, guide) {
    return {
      navigate: path ? `$/${path}` : '/',
      label,
      icon,
      guide,
    };
  }

  return obscureSideBar ? (
    <StickyBox offsetTop={100} offsetBottom={20}>
      <div className="card navigation--placeholder">
        <div className="wrap">
          <h2>LBRY</h2>

          <p>{__('The best decentralized content platform on the web.')}</p>
        </div>
      </div>
    </StickyBox>
  ) : (
    <StickyBox offsetTop={100} offsetBottom={20}>
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
            <li key={linkProps.label}>
              <Button {...linkProps} className="navigation-link" activeClass="navigation-link--active" />
            </li>
          ))}
        </ul>

        <Button
          navigate={`/$/${PAGES.FOLLOWING}`}
          label={__('Customize')}
          icon={ICONS.EDIT}
          className="navigation-link"
          activeClass="navigation-link--active"
        />
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
    </StickyBox>
  );
}

export default SideBar;
