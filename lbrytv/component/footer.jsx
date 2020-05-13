// @flow
import React from 'react';
import Button from 'component/button';

const sections = [
  {
    name: 'Community',
    links: [
      {
        label: 'Twitter',
        link: 'https://twitter.com/lbryio',
      },
      {
        label: 'Reddit',
        link: 'https://reddit.com/lbry',
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
        label: 'Support',
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
    ],
  },
];

export default function Footer() {
  return (
    <footer className="footer">
      {sections.map(({ name, links }) => {
        return (
          <div key={name} className="footer__section">
            <div className="footer__section-title">{name}</div>
            <ul className="ul--no-style">
              {links.map(({ label, link }) => (
                <li key={label}>
                  <Button className="footer__link" href={link} label={label} />
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </footer>
  );
}
