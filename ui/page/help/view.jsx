// @flow
import { SITE_NAME, SITE_HELP_EMAIL } from 'config';
import * as ICONS from 'constants/icons';
import * as React from 'react';
import Button from 'component/button';
import Page from 'component/page';
import Card from 'component/common/card';
import I18nMessage from 'component/i18nMessage';

export default function HelpPage() {
  return (
    <Page className="card-stack">
      <Card
        title={__('Visit the %SITE_NAME% Help Hub', { SITE_NAME })}
        subtitle={__('Our support posts answer many common questions.')}
        actions={
          <div className="section__actions">
            <Button
              href="https://odysee.com/@OdyseeHelp:b"
              label={__('View %SITE_NAME% Help Hub', { SITE_NAME })}
              icon={ICONS.HELP}
              button="secondary"
            />
          </div>
        }
      />

      <Card
        title={__('Find assistance')}
        subtitle={
          <I18nMessage tokens={{ channel: <strong>#support</strong>, help_email: SITE_HELP_EMAIL }}>
            Live help is available most hours in the %channel% channel of our Discord chat room. Or you can always email
            us at %help_email%.
          </I18nMessage>
        }
        actions={
          <div className="section__actions">
            <Button
              button="secondary"
              label={__('Join our Discord')}
              icon={ICONS.CHAT}
              href="https://chat.odysee.com"
            />
            <Button button="secondary" label={__('Email Us')} icon={ICONS.WEB} href={`mailto:${SITE_HELP_EMAIL}`} />
          </div>
        }
      />

      <Card
        title={__('Report a bug or suggest something')}
        subtitle={__('Did you find something wrong? Think Odysee could add something useful and cool?')}
        actions={
          <div className="section__actions">
            <Button navigate="/$/report" label={__('Submit Feedback')} icon={ICONS.FEEDBACK} button="secondary" />
          </div>
        }
      />
    </Page>
  );
}
