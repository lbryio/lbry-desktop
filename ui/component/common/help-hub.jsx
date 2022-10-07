// @flow
// import * as ICONS from 'constants/icons';
import React from 'react';
import I18nMessage from 'component/i18nMessage';

type Props = {
  href?: string,
  image?: string,
  description?: string,
  text?: string,
};

export default function HelpHub(props: Props) {
  const { href, image, text } = props;

  const hubMessage = (text, href) => {
    return (
      <I18nMessage
        tokens={{
          help_hub: (
            <a rel="noopener noreferrer" href={href} target="_blank">
              {__('Help Hub')}
            </a>
          ),
        }}
      >
        {text}
      </I18nMessage>
    );
  };

  return (
    <div className="help-hub__wrapper">
      <span>{hubMessage(text, href)}</span>
      {image && (
        <img
          src={
            'https://thumbnails.odycdn.com/optimize/s:46:0/quality:95/plain/https://static.odycdn.com/images/helpHub_' +
            image +
            '.png'
          }
        />
      )}
    </div>
  );
}
