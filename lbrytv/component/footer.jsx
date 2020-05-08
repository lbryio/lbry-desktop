// @flow
import React from 'react';
import Button from 'component/button';

const sections = [
  {
    name: 'Talk To Us',
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
        label: 'Discord',
        link: 'https://chat.lbry.com/',
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
    name: 'Learn More',
    links: [
      {
        label: 'FAQ',
        link: 'https://lbry.com/faq',
      },
      {
        label: 'lbry.tech',
        link: 'https://lbry.tech',
      },
      {
        label: 'Github',
        link: 'https://github.com/lbryio/lbry-desktop',
      },
    ],
  },
  {
    name: 'Other',
    links: [
      {
        label: 'Support',
        link: 'https://lbry.com/faq/support',
      },
      {
        label: 'Terms of Service',
        link: 'https://www.lbry.com/termsofservice',
      },
      {
        label: '2257',
        link: '',
      },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="footer">
      {sections.map(({ name, links }) => {
        return (
          <div key={name}>
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
