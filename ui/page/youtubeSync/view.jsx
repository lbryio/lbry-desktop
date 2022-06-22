// @flow
import { SITE_NAME, DOMAIN } from 'config';
import * as PAGES from 'constants/pages';
import SUPPORTED_LANGUAGES from 'constants/supported_languages';
import React from 'react';
import Page from 'component/page';
import Button from 'component/button';
import Card from 'component/common/card';
import I18nMessage from 'component/i18nMessage';
import { Form, FormField } from 'component/common/form';
import { INVALID_NAME_ERROR } from 'constants/claim';
import { isNameValid } from 'util/lbryURI';
import { Lbryio } from 'lbryinc';
import { useHistory } from 'react-router';
import YoutubeTransferStatus from 'component/youtubeTransferStatus';
import Nag from 'component/common/nag';
import { getDefaultLanguage, sortLanguageMap } from 'util/default-languages';

const STATUS_TOKEN_PARAM = 'status_token';
const ERROR_MESSAGE_PARAM = 'error_message';
const NEW_CHANNEL_PARAM = 'new_channel';

type Props = {
  youtubeChannels: ?Array<{ transfer_state: string, sync_status: string }>,
  doUserFetch: () => void,
  inSignUpFlow?: boolean,
  doToggleInterestedInYoutubeSync: () => void,
};

export default function YoutubeSync(props: Props) {
  const { youtubeChannels, doUserFetch, inSignUpFlow = false, doToggleInterestedInYoutubeSync } = props;
  const {
    location: { search, pathname },
    push,
    replace,
  } = useHistory();
  const urlParams = new URLSearchParams(search);
  const statusToken = urlParams.get(STATUS_TOKEN_PARAM);
  const errorMessage = urlParams.get(ERROR_MESSAGE_PARAM);
  const newChannelParam = urlParams.get(NEW_CHANNEL_PARAM);
  const [channel, setChannel] = React.useState('');
  const [language, setLanguage] = React.useState(getDefaultLanguage());
  const [nameError, setNameError] = React.useState(undefined);
  const [acknowledgedTerms, setAcknowledgedTerms] = React.useState(false);
  const [addingNewChannel, setAddingNewChannel] = React.useState(newChannelParam);
  const hasYoutubeChannels = youtubeChannels && youtubeChannels.length > 0;

  React.useEffect(() => {
    const urlParamsInEffect = new URLSearchParams(search);
    if (!urlParamsInEffect.get('reset_scroll')) {
      urlParamsInEffect.append('reset_scroll', 'youtube');
    }

    replace(`?${urlParamsInEffect.toString()}`);
  }, [pathname, search]);

  React.useEffect(() => {
    if (statusToken && !hasYoutubeChannels) {
      doUserFetch();
    }
  }, [statusToken, hasYoutubeChannels, doUserFetch]);

  React.useEffect(() => {
    if (!newChannelParam) {
      setAddingNewChannel(false);
    }
  }, [newChannelParam]);

  function handleCreateChannel() {
    Lbryio.call('yt', 'new', {
      type: 'sync',
      immediate_sync: true,
      channel_language: language,
      desired_lbry_channel_name: `@${channel}`,
      return_url: `https://${DOMAIN}/$/${inSignUpFlow ? PAGES.AUTH : PAGES.YOUTUBE_SYNC}`,
    }).then((ytAuthUrl) => {
      // react-router isn't needed since it's a different domain
      window.location.href = ytAuthUrl;
    });
  }

  function handleChannelChange(e) {
    const { value } = e.target;
    setChannel(value);
    if (!isNameValid(value)) {
      setNameError(INVALID_NAME_ERROR);
    } else {
      setNameError();
    }
  }

  function handleNewChannel() {
    urlParams.append('new_channel', 'true');
    push(`${pathname}?${urlParams.toString()}`);
    setAddingNewChannel(true);
  }

  const Wrapper = (props: { children: any }) => {
    return inSignUpFlow ? (
      <>{props.children}</>
    ) : (
      <Page noSideNavigation authPage>
        {props.children}
      </Page>
    );
  };

  return (
    <Wrapper>
      <div className="main__channel-creation">
        {hasYoutubeChannels && !addingNewChannel ? (
          <YoutubeTransferStatus alwaysShow addNewChannel={handleNewChannel} />
        ) : (
          <Card
            title={__('Sync your YouTube channel to %site_name%', { site_name: IS_WEB ? SITE_NAME : 'LBRY' })}
            subtitle={__('Get your YouTube videos in front of the %site_name% audience.', {
              site_name: IS_WEB ? SITE_NAME : 'LBRY',
            })}
            actions={
              <Form onSubmit={handleCreateChannel}>
                <fieldset-group class="fieldset-group--smushed fieldset-group--disabled-prefix">
                  <fieldset-section>
                    <label htmlFor="auth_first_channel">
                      {nameError ? (
                        <span className="error__text">{nameError}</span>
                      ) : (
                        __('Your desired %site_name% channel name', { site_name: IS_WEB ? SITE_NAME : 'LBRY' })
                      )}
                    </label>
                    <div className="form-field__prefix">@</div>
                  </fieldset-section>

                  <FormField
                    autoFocus
                    placeholder={__('channel')}
                    type="text"
                    name="yt_sync_channel"
                    className="form-field--short"
                    value={channel}
                    onChange={handleChannelChange}
                  />
                </fieldset-group>
                <FormField
                  name="language_select"
                  type="select"
                  label={__('Channel language')}
                  onChange={(event) => setLanguage(event.target.value)}
                  value={language}
                >
                  {sortLanguageMap(SUPPORTED_LANGUAGES).map(([langKey, langName]) => (
                    <option key={langKey} value={langKey}>
                      {langName}
                    </option>
                  ))}
                </FormField>
                <FormField
                  type="checkbox"
                  name="yt_sync_terms"
                  checked={acknowledgedTerms}
                  onChange={() => setAcknowledgedTerms(!acknowledgedTerms)}
                  label={
                    <I18nMessage
                      tokens={{
                        terms: (
                          <Button button="link" label={__('these terms')} href="https://odysee.com/$/youtubetos" />
                        ),
                        faq: (
                          <Button
                            button="link"
                            label={__('how the program works')}
                            href="https://odysee.com/@OdyseeHelp:b/youtube-sync:b"
                          />
                        ),
                        site_name: SITE_NAME,
                      }}
                    >
                      I want to sync my content to %site_name% and the LBRY network and agree to %terms%. I have also
                      read and understand %faq%.
                    </I18nMessage>
                  }
                />

                <div className="section__actions">
                  <Button
                    button="primary"
                    type="submit"
                    disabled={nameError || !channel || !acknowledgedTerms}
                    label={__('Claim Now')}
                  />

                  {inSignUpFlow && !errorMessage && (
                    <Button button="link" label={__('Skip')} onClick={() => doToggleInterestedInYoutubeSync()} />
                  )}

                  {errorMessage && <Button button="link" label={__('Skip')} navigate={`/$/${PAGES.REWARDS}`} />}
                </div>
                <div className="help--card-actions">
                  <I18nMessage
                    tokens={{
                      count: 100,
                      learn_more: (
                        <Button
                          button="link"
                          label={__('Learn more')}
                          href="https://odysee.com/@OdyseeHelp:b/youtube-sync:b"
                        />
                      ),
                    }}
                  >
                    This will verify you are an active YouTuber with over %count% subscribers and original content.
                    Channel names cannot be changed once chosen, please be extra careful. %learn_more%.
                  </I18nMessage>
                </div>
              </Form>
            }
            nag={errorMessage && <Nag message={errorMessage} type="error" relative />}
          />
        )}
      </div>
    </Wrapper>
  );
}
