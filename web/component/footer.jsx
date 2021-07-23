import React from 'react';
import Button from 'component/button';
import I18nMessage from 'component/i18nMessage';
import { SIMPLE_SITE } from 'config';

export default function Footer() {
  if (!SIMPLE_SITE) {
    return null;
  }
  return (
    <footer className="footer">
      <span className="footer__section-title">
        <I18nMessage tokens={{ lbry_link: <Button button="link" label={'LBRY'} href="https://lbry.com" /> }}>
          POWERED BY %lbry_link%
        </I18nMessage>
      </span>
      <ul className="navigation__tertiary footer__links">
        <li className="footer__link">
          <Button label={__('About --[link title in Sidebar or Footer]--')} href="https://lbry.com/about" />
        </li>
        <li className="footer__link">
          <Button label={__('Community Guidelines')} href="https://odysee.com/@OdyseeHelp:b/Community-Guidelines:c" />
        </li>
        <li className="footer__link">
          <Button label={__('FAQ')} href="https://odysee.com/@OdyseeHelp:b" />
        </li>
        <li className="footer__link">
          <Button label={__('Support --[used in footer; general help/support]--')} href="https://lbry.com/support" />
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
