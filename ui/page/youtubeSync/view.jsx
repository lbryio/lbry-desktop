// @flow
import { SITE_NAME, DOMAIN } from 'config';
import * as PAGES from 'constants/pages';
import React from 'react';
import Page from 'component/page';
import Button from 'component/button';
import Card from 'component/common/card';
import I18nMessage from 'component/i18nMessage';
import { Form, FormField } from 'component/common/form';
import { INVALID_NAME_ERROR } from 'constants/claim';
import { isNameValid } from 'lbry-redux';
import { Lbryio } from 'lbryinc';
import { useHistory } from 'react-router';
import YoutubeTransferStatus from 'component/youtubeTransferStatus';
import Nag from 'component/common/nag';

const STATUS_TOKEN_PARAM = 'status_token';
const ERROR_MESSAGE_PARAM = 'error_message';
const NEW_CHANNEL_PARAM = 'new_channel';

type Props = {
  youtubeChannels: ?Array<{ transfer_state: string, sync_status: string }>,
  doUserFetch: () => void,
};

export default function YoutubeSync(props: Props) {
  const { youtubeChannels, doUserFetch } = props;
  const {
    location: { search, pathname },
    push,
  } = useHistory();
  const urlParams = new URLSearchParams(search);
  const statusToken = urlParams.get(STATUS_TOKEN_PARAM);
  const errorMessage = urlParams.get(ERROR_MESSAGE_PARAM);
  const newChannelParam = urlParams.get(NEW_CHANNEL_PARAM);
  const [channel, setChannel] = React.useState('');
  const [nameError, setNameError] = React.useState(undefined);
  const [acknowledgedTerms, setAcknowledgedTerms] = React.useState(false);
  const [addingNewChannel, setAddingNewChannel] = React.useState(newChannelParam);
  const hasYoutubeChannels = youtubeChannels && youtubeChannels.length > 0;

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
      desired_lbry_channel_name: `@${channel}`,
      return_url: `https://${DOMAIN}/$/${PAGES.YOUTUBE_SYNC}`,
    }).then(ytAuthUrl => {
      // react-router isn't needed since it's a different domain
      window.location.href = ytAuthUrl;
    });
  }

  function handleChannelChange(e) {
    const { value } = e.target;
    setChannel(value);
    if (!isNameValid(value, 'false')) {
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

  return (
    <Page noSideNavigation authPage>
      <div className="main__channel-creation">
        {hasYoutubeChannels && !addingNewChannel ? (
          <YoutubeTransferStatus alwaysShow addNewChannel={handleNewChannel} />
        ) : (
          <Card
            title={__('Connect with your fans while earning rewards')}
            subtitle={__('Get your YouTube videos in front of the %site_name% audience.', {
              site_name: IS_WEB ? SITE_NAME : 'LBRY',
            })}
            actions={
              <Form onSubmit={handleCreateChannel}>
                <fieldset-group class="fieldset-group--smushed fieldset-group--disabled-prefix">
                  <fieldset-section>
                    <label htmlFor="auth_first_channel">
                      {nameError ? <span className="error__text">{nameError}</span> : __('Your Channel')}
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
                  type="checkbox"
                  name="yt_sync_terms"
                  checked={acknowledgedTerms}
                  onChange={() => setAcknowledgedTerms(!acknowledgedTerms)}
                  label={
                    <I18nMessage
                      tokens={{
                        terms: (
                          <Button button="link" label={__('these terms')} href="https://lbry.com/faq/youtube-terms" />
                        ),
                        faq: (
                          <Button
                            button="link"
                            label={__('how the program works')}
                            href="https://lbry.com/faq/youtube"
                          />
                        ),
                      }}
                    >
                      I want to sync my content to the LBRY network and agree to %terms%. I have also read and
                      understand %faq%.
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

                  {errorMessage && <Button button="link" label={__('Skip')} navigate={`/$/${PAGES.REWARDS}`} />}
                </div>
                <div className="help--card-actions">
                  <I18nMessage
                    tokens={{
                      learn_more: <Button button="link" label={__('Learn more')} href="https://lbry.com/faq/youtube" />,
                    }}
                  >
                    This will verify you are an active YouTuber. Channel names cannot be changed once chosen, please be
                    extra careful. Additional instructions will be emailed to you after you verify your email on the
                    next page. %learn_more%.
                  </I18nMessage>
                </div>
              </Form>
            }
            nag={errorMessage && <Nag message={errorMessage} type="error" relative />}
          />
        )}
      </div>
    </Page>
  );
}
