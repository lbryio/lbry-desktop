// @flow
// import * as PAGES from 'constants/pages';
import React from 'react';
import Button from 'component/button';
import I18nMessage from 'component/i18nMessage';

// const sections = [
//   {
//     name: 'Community',
//     links: [
//       {
//         label: 'Twitter',
//         link: 'https://twitter.com/lbrycom',
//       },
//       {
//         label: 'Reddit',
//         link: 'https://reddit.com/r/lbry',
//       },
//       {
//         label: 'Chat (Discord)',
//         link: 'https://chat.lbry.org/',
//       },
//       {
//         label: 'Telegram',
//         link: 'https://t.me/lbryofficial',
//       },
//       {
//         label: 'Facebook',
//         link: 'https://www.facebook.com/lbryio',
//       },
//     ],
//   },
//   {
//     name: 'Resources',
//     links: [
//       {
//         label: 'FAQ',
//         link: 'https://lbry.com/faq',
//       },
//       {
//         label: 'Support',
//         link: 'https://lbry.com/faq/support',
//       },
//       {
//         label: 'YouTube Partner Program',
//         link: 'https://lbry.com/youtube',
//       },
//       {
//         label: 'lbry.com',
//         link: 'https://lbry.com',
//       },
//       {
//         label: 'lbry.tech',
//         link: 'https://lbry.tech',
//       },
//       {
//         label: 'GitHub',
//         link: 'https://github.com/lbryio',
//       },
//     ],
//   },
//   {
//     name: 'Policies',
//     links: [
//       {
//         label: 'Terms of Service',
//         link: 'https://www.lbry.com/termsofservice',
//       },
//       {
//         label: 'Privacy Policy',
//         link: 'https://lbry.com/privacypolicy',
//       },
//       {
//         label: '2257',
//         navigate: `/$/${PAGES.CODE_2257}`,
//       },
//     ],
//   },
// ];

// Disabled for experiment
// {sections.map(({ name, links }) => {
//   return (
// 	<div key={name} className="footer__section">
// 	  <div className="footer__section-title">{name}</div>
// 	  <ul className="ul--no-style">
// 		{/* $FlowFixMe */}
// 		{links.map(({ label, link, navigate }) => {
// 		  return (
// 			<li key={label}>
// 			  <Button className="footer__link" href={link} navigate={navigate} label={label} />
// 			</li>
// 		  );
// 		})}
// 	  </ul>
// 	</div>
//   );
// })}
export default function Footer() {
  return (
    <footer className="footer">
      <span className="footer__section-title">
        <I18nMessage tokens={{ lbry_link: <Button button="link" label={'LBRY'} href="https://lbry.com" /> }}>
          POWERED BY %lbry_link%
        </I18nMessage>
      </span>
      <ul className="navigation__tertiary footer__links">
        <li className="footer__link">
          <Button label={__('About')} href="https://lbry.com/about" />
        </li>
        <li className="footer__link">
          <Button label={__('FAQ')} href="https://odysee.com/@OdyseeHelp:b" />
        </li>
        <li className="footer__link">
          <Button label={__('Support')} href="https://lbry.com/support" />
        </li>
        <li className="footer__link">
          <Button label={__('Terms')} href="https://lbry.com/termsofservice" />
        </li>
        <li className="footer__link">
          <Button label={__('Privacy Policy')} href="https://lbry.com/privacy" />
        </li>
      </ul>
    </footer>
  );
}
