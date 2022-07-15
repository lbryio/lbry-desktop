// @flow
import { SITE_NAME, SITE_HELP_EMAIL } from 'config';
import * as ICONS from 'constants/icons';
import * as React from 'react';
import Button from 'component/button';
import Page from 'component/page';
import Card from 'component/common/card';
import I18nMessage from 'component/i18nMessage';
import { getAuthToken } from 'util/saved-passwords';
import CopyableText from 'component/copyableText';

import * as MODALS from 'constants/modal_types';

type Props = {
  announcement: string,
  doOpenModal: (string, ?{}) => void,
  user: any,
};

export default function HelpPage(props: Props) {
  const { announcement, doOpenModal, user } = props;

  const canViewToken = process.env.ENABLE_WIP_FEATURES || (user && user.internal_feature);

  const authToken = canViewToken && getAuthToken();

  return (
    <Page className="card-stack">
      {announcement && (
        <Card
          title={__("What's New")}
          subtitle={__('See what are the latest features and changes in Odysee.')}
          actions={
            <div className="section__actions">
              <Button
                label={__("What's New")}
                icon={ICONS.FEEDBACK}
                button="secondary"
                onClick={() => doOpenModal(MODALS.ANNOUNCEMENTS)}
              />
            </div>
          }
        />
      )}

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
        title={__('Email change and account deletion')}
        subtitle={
          <I18nMessage tokens={{ channel: <strong>#support</strong>, help_email: SITE_HELP_EMAIL }}>
            Email address changes and account removal are processed manually on request via email. Email must come from
            the original email being changed, or we'll need need to verify ownership another way.
          </I18nMessage>
        }
        actions={
          <Button button="secondary" label={__('Email Us')} icon={ICONS.WEB} href={`mailto:${SITE_HELP_EMAIL}`} />
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

      {canViewToken && authToken && (
        <Card
          className="section"
          title={__('Your Access Token')}
          actions={
            <>
              <CopyableText
                primaryButton
                enableInputMask
                name="access-token"
                label={__('Authentication Token - do not share, this works like a password!')}
                copyable={authToken}
                snackMessage={__('Copied token')}
              />
            </>
          }
        />
      )}
    </Page>
  );
}
