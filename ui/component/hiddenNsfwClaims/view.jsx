// @flow
import React from 'react';
import Button from 'component/button';
import I18nMessage from 'component/i18nMessage';

type Props = {
  numberOfHiddenClaims: number,
  obscureNsfw: boolean,
  className: ?string,
};

export default (props: Props) => {
  const { numberOfHiddenClaims: number, obscureNsfw } = props;

  return (
    obscureNsfw &&
    Boolean(number) && (
      <div className="section--padded section__subtitle">
        <I18nMessage
          tokens={{
            content_viewing_preferences_link: (
              <Button button="link" navigate="/$/settings" label={__('content viewing preferences')} />
            ),
            number: number,
          }}
        >
          {number > 1
            ? '%number% files hidden due to your %content_viewing_preferences_link%'
            : '1 file hidden due to your %content_viewing_preferences_link%'}
        </I18nMessage>
      </div>
    )
  );
};
