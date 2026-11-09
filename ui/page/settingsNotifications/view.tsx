import * as ICONS from 'constants/icons';
import * as SETTINGS from 'constants/settings';
import * as React from 'react';

import Page from 'component/page';
import { FormField } from 'component/common/form';
import Card from 'component/common/card';
import SettingsRow from 'component/settingsRow';
import { Lbryio } from 'lbryinc';
import { useHistory } from 'react-router';
import Yrbl from 'component/yrbl';
import Button from 'component/button';

type Props = {
  osNotificationsEnabled: boolean,
  isAuthenticated: boolean,
  setClientSetting: (arg1: string, arg2: boolean) => void
};

export default function NotificationSettingsPage(props: Props) {
  const { osNotificationsEnabled, setClientSetting, isAuthenticated } = props;
  const [error, setError] = React.useState<any>();
  const [tagMap, setTagMap] = React.useState({});
  const [tags, setTags] = React.useState<any>();
  const [enabledEmails, setEnabledEmails] = React.useState<any>();
  const { location } = useHistory();
  const urlParams = new URLSearchParams(location.search);
  const verificationToken = urlParams.get('verification_token');
  const lbryIoParams = verificationToken ? { auth_token: verificationToken } : undefined;

  React.useEffect(() => {
    if (isAuthenticated) {
      // @ts-expect-error - TS2339 (ts-migration)
      Lbryio.call('tag', 'list', lbryIoParams)
        .then(setTags)
        .catch((e) => {
          setError(true);
        });

      // @ts-expect-error - TS2339 (ts-migration)
      Lbryio.call('user_email', 'status', lbryIoParams)
        .then((res) => {
          const enabledEmails =
            res.emails &&
            Object.keys(res.emails).reduce<Array<any>>((acc, email) => {
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
  }, [lbryIoParams, isAuthenticated]);

  function handleChangeTag(name: unknown, newIsEnabled: unknown) {
    const tagParams = newIsEnabled ? { add: name } : { remove: name };

    // @ts-expect-error - TS2339 (ts-migration)
    Lbryio.call('user_tag', 'edit', { ...lbryIoParams, ...tagParams }).then(() => {
      const newTagMap = { ...tagMap } as const;
// @ts-expect-error - TS2538 - Type 'unknown' cannot be used as an index type.
      newTagMap[name] = newIsEnabled;

      setTagMap(newTagMap);
    });
  }

  function handleChangeEmail(email: unknown, newIsEnabled: unknown) {
    // @ts-expect-error - TS2339 (ts-migration)
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

  return (
    <Page
      noFooter
      noSideNavigation
      settingsPage
      className="card-stack"
      // @ts-expect-error - TS2741 (ts-migration)
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
                // @ts-expect-error - TS2322 (ts-migration)
                button="secondary"
                label={__('Refresh')}
                icon={ICONS.REFRESH}
                onClick={() => window.location.reload()}
              />
              {/* @ts-expect-error - TS2322 (ts-migration) */}
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
// @ts-expect-error - TS2322 - Type '{ type: string; name: string; onChange: () => void; checked: boolean; }' is not assignable to type 'IntrinsicAttributes & IntrinsicClassAttributes<FormField> & Pick<Readonly<Props> & Readonly<{ children?: ReactNode; }>, "error" | ... 22 more ... | "onChange"> & InexactPartial<...> & InexactPartial<...>'.
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
                      // @ts-expect-error - TS2741 (ts-migration)
                      <SettingsRow key={email} subtitle={__(email)}>
                        <FormField
                          type="checkbox"
                          name={`active-email:${email}`}
                          key={email}
                          onChange={() => handleChangeEmail(email, !isEnabled)}
// @ts-expect-error - TS2322 - Type '{ type: string; name: string; key: any; onChange: () => void; checked: any; }' is not assignable to type 'IntrinsicAttributes & IntrinsicClassAttributes<FormField> & Pick<Readonly<Props> & Readonly<{ children?: ReactNode; }>, "error" | ... 22 more ... | "onChange"> & InexactPartial<...> & InexactPartial<...>'.
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
                        // @ts-expect-error - TS2741 (ts-migration)
                        <SettingsRow key={tag.name} subtitle={__(tag.description)}>
                          <FormField
                            type="checkbox"
                            key={tag.name}
                            name={tag.name}
                            onChange={() => handleChangeTag(tag.name, !isEnabled)}
// @ts-expect-error - TS2322 - Type '{ type: string; key: any; name: any; onChange: () => void; checked: any; }' is not assignable to type 'IntrinsicAttributes & IntrinsicClassAttributes<FormField> & Pick<Readonly<Props> & Readonly<{ children?: ReactNode; }>, "error" | ... 22 more ... | "onChange"> & InexactPartial<...> & InexactPartial<...>'.
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
