// @flow
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import * as SETTINGS from 'constants/settings';
import * as React from 'react';

import Page from 'component/page';
import { FormField } from 'component/common/form';
import Card from 'component/common/card';
import SettingsRow from 'component/settingsRow';
import { Lbryio } from 'lbryinc';
import { useHistory } from 'react-router';
import { Redirect } from 'react-router-dom';
import Yrbl from 'component/yrbl';
import Button from 'component/button';

type Props = {
  osNotificationsEnabled: boolean,
  isAuthenticated: boolean,
  setClientSetting: (string, boolean) => void,
};

export default function NotificationSettingsPage(props: Props) {
  const { osNotificationsEnabled, setClientSetting, isAuthenticated } = props;
  const [error, setError] = React.useState();
  const [tagMap, setTagMap] = React.useState({});
  const [tags, setTags] = React.useState();
  const [enabledEmails, setEnabledEmails] = React.useState();
  const { location } = useHistory();
  const urlParams = new URLSearchParams(location.search);
  const verificationToken = urlParams.get('verification_token');
  const lbryIoParams = verificationToken ? { auth_token: verificationToken } : undefined;

  React.useEffect(() => {
    if (isAuthenticated) {
      Lbryio.call('tag', 'list', lbryIoParams)
        .then(setTags)
        .catch((e) => {
          setError(true);
        });

      Lbryio.call('user_email', 'status', lbryIoParams)
        .then((res) => {
          const enabledEmails =
            res.emails &&
            Object.keys(res.emails).reduce((acc, email) => {
              const isEnabled = res.emails[email];
              return [...acc, { email, isEnabled }];
            }, []);

          setTagMap(res.tags);
          setEnabledEmails(enabledEmails);
        })
        .catch((e) => {
          setError(true);
        });
    }
  }, [isAuthenticated]);

  function handleChangeTag(name, newIsEnabled) {
    const tagParams = newIsEnabled ? { add: name } : { remove: name };

    Lbryio.call('user_tag', 'edit', { ...lbryIoParams, ...tagParams }).then(() => {
      const newTagMap = { ...tagMap };
      newTagMap[name] = newIsEnabled;

      setTagMap(newTagMap);
    });
  }

  function handleChangeEmail(email, newIsEnabled) {
    Lbryio.call('user_email', 'edit', {
      email: email,
      enabled: newIsEnabled,
      ...lbryIoParams,
    })
      .then(() => {
        const newEnabledEmails = enabledEmails
          ? enabledEmails.map((userEmail) => {
              if (email === userEmail.email) {
                return { email, isEnabled: newIsEnabled };
              }

              return userEmail;
            })
          : [];

        setEnabledEmails(newEnabledEmails);
      })
      .catch((e) => {
        setError(true);
      });
  }

  if (IS_WEB && !isAuthenticated && !verificationToken) {
    return <Redirect to={`/$/${PAGES.AUTH_SIGNIN}?redirect=${location.pathname}`} />;
  }

  return (
    <Page
      noFooter
      noSideNavigation
      settingsPage
      className="card-stack"
      backout={{ title: __('Manage notifications'), backLabel: __('Back') }}
    >
      {error ? (
        <Yrbl
          type="sad"
          title={__('Uh oh')}
          subtitle={__('There was an error displaying this page.')}
          actions={
            <div className="section__actions">
              <Button
                button="secondary"
                label={__('Refresh')}
                icon={ICONS.REFRESH}
                onClick={() => window.location.reload()}
              />
              <Button button="secondary" label={__('Go Home')} icon={ICONS.HOME} navigate={'/'} />
            </div>
          }
        />
      ) : (
        <div className="card-stack">
          {/* @if TARGET='app' */}
          <div>
            <h2 className="card__title">{__('App notifications')}</h2>
            <div className="card__subtitle">{__('Notification settings for the desktop app.')}</div>
          </div>
          <Card
            isBodyList
            body={
              <SettingsRow
                title={__('Show Desktop Notifications')}
                subtitle={__('Get notified when an upload or channel is confirmed.')}
              >
                <FormField
                  type="checkbox"
                  name="desktopNotification"
                  onChange={() => setClientSetting(SETTINGS.OS_NOTIFICATIONS_ENABLED, !osNotificationsEnabled)}
                  checked={osNotificationsEnabled}
                />
              </SettingsRow>
            }
          />
          {/* @endif */}

          {enabledEmails && enabledEmails.length > 0 && (
            <>
              <div>
                <h2 className="card__title">
                  {enabledEmails.length === 1 ? __('Your email') : __('Receiving addresses')}
                </h2>
                <div className="card__subtitle">
                  {__('Uncheck your email below if you want to stop receiving messages.')}
                </div>
              </div>
              <Card
                isBodyList
                body={
                  <>
                    {enabledEmails.map(({ email, isEnabled }) => (
                      <SettingsRow key={email} subtitle={__(email)}>
                        <FormField
                          type="checkbox"
                          name={`active-email:${email}`}
                          key={email}
                          onChange={() => handleChangeEmail(email, !isEnabled)}
                          checked={isEnabled}
                        />
                      </SettingsRow>
                    ))}
                  </>
                }
              />
            </>
          )}

          {tags && tags.length > 0 && (
            <>
              <div>
                <h2 className="card__title">{__('Email preferences')}</h2>
                <div className="card__subtitle">
                  {__("Opt out of any topics you don't want to receive email about.")}
                </div>
              </div>
              <Card
                isBodyList
                body={
                  <>
                    {tags.map((tag) => {
                      const isEnabled = tagMap[tag.name];
                      return (
                        <SettingsRow key={tag.name} subtitle={__(tag.description)}>
                          <FormField
                            type="checkbox"
                            key={tag.name}
                            name={tag.name}
                            onChange={() => handleChangeTag(tag.name, !isEnabled)}
                            checked={isEnabled}
                          />
                        </SettingsRow>
                      );
                    })}
                  </>
                }
              />
            </>
          )}
        </div>
      )}
    </Page>
  );
}
