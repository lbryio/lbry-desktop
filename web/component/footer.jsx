import React, { useEffect } from 'react';
import Button from 'component/button';
import { SIMPLE_SITE } from 'config';

export default function Footer() {
  useEffect(() => {
    if (!window.sp) {
      const privacyFooterButton = document.getElementById('gdprPrivacyFooter');
      if (privacyFooterButton) privacyFooterButton.style.display = 'none';
    }
  }, []);

  if (!SIMPLE_SITE) {
    return null;
  }
  return (
    <footer className="footer">
      <ul className="navigation__tertiary footer__links">
        <li className="footer__link">
          <Button label={__('Community Guidelines')} href="https://odysee.com/@OdyseeHelp:b/Community-Guidelines:c" />
        </li>
        <li className="footer__link">
          <Button label={__('FAQ')} href="https://odysee.com/@OdyseeHelp:b" />
        </li>
        <li className="footer__link">
          <Button
            label={__('Support --[used in footer; general help/support]--')}
            href="https://odysee.com/@OdyseeHelp:b"
          />
        </li>
        <li className="footer__link">
          <Button label={__('Terms')} href="https://odysee.com/$/tos" />
        </li>
        <li className="footer__link">
          <Button label={__('Privacy Policy')} href="https://odysee.com/$/privacypolicy" />
        </li>
        <li className="footer__link" id="gdprPrivacyFooter">
          <Button label={__('Cookies')} onClick={() => window.sp && window.sp.showPrivacyBanner()} />
        </li>
      </ul>
    </footer>
  );
}
