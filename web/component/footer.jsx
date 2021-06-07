// @flow
import * as PAGES from 'constants/pages';
import React from 'react';
import Button from 'component/button';

const sections = [
  {
    name: 'Community',
    links: [
      {
        label: 'Twitter',
        link: 'https://twitter.com/lbrycom',
      },
      {
        label: 'Reddit',
        link: 'https://reddit.com/r/lbry',
      },
      {
        label: 'Chat (Discord)',
        link: 'https://chat.lbry.org/',
      },
      {
        label: 'Telegram',
        link: 'https://t.me/lbryofficial',
      },
      {
        label: 'Facebook',
        link: 'https://www.facebook.com/lbryio',
      },
    ],
  },
  {
    name: 'Resources',
    links: [
      {
        label: 'FAQ',
        link: 'https://lbry.com/faq',
      },
      {
        label: 'Support --[used in footer; general help/support]--',
        link: 'https://lbry.com/faq/support',
      },
      {
        label: 'YouTube Partner Program',
        link: 'https://lbry.com/youtube',
      },
      {
        label: 'lbry.com',
        link: 'https://lbry.com',
      },
      {
        label: 'lbry.tech',
        link: 'https://lbry.tech',
      },
      {
        label: 'GitHub',
        link: 'https://github.com/lbryio',
      },
    ],
  },
  {
    name: 'Policies',
    links: [
      {
        label: 'Terms of Service',
        link: 'https://www.lbry.com/termsofservice',
      },
      {
        label: 'Privacy Policy',
        link: 'https://lbry.com/privacypolicy',
      },
      {
        label: '2257',
        navigate: `/$/${PAGES.CODE_2257}`,
      },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="footer">
      <ul className="navigation__tertiary footer__links bright ul--no-style">
        {sections.map(({ name, links }) => {
          return (
            <li key={name} className="footer__section">
              <div className="footer__section-title">{__(name)}</div>
              {links.map(({ label, link, navigate }) => {
                return (
                  <li key={label}>
                    <Button className="footer__link" label={__(label)} href={link} navigate={navigate} />
                  </li>
                );
              })}
            </li>
          );
        })}
      </ul>
    </footer>
  );
}
