import React from 'react';
import Button from 'component/button';
import I18nMessage from 'component/i18nMessage';

export default function Footer() {
  return (
    <footer className="footer">
      <ul className="navigation__tertiary footer__links ul--no-style">
        {sections.map(({ name, links }) => {
          return (
            <li key={name} className="footer__section">
              <ul className="ul--no-style">
                <div className="footer__section-title">{__(name)}</div>
                {links.map(({ label, link, navigate }) => {
                  return (
                    <li key={label}>
                      <Button className="footer__link" label={__(label)} href={link} navigate={navigate} />
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ul>
    </footer>
  );
}
