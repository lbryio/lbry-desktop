// @flow
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import React from 'react';
import * as SETTINGS from 'constants/settings';
import { Lbryio } from 'lbryinc';
import { SIMPLE_SITE } from 'config';
import * as MODALS from 'constants/modal_types';
import { SETTINGS_GRP } from 'constants/settings';
import Button from 'component/button';
import Card from 'component/common/card';
import { FormField, FormFieldPrice } from 'component/common/form';
import MaxPurchasePrice from 'component/maxPurchasePrice';
import SettingsRow from 'component/settingsRow';
import SettingDefaultQuality from 'component/settingDefaultQuality';

type Price = {
  currency: string,
  amount: number,
};

type Props = {
  // --- select ---
  isAuthenticated: boolean,
  floatingPlayer: boolean,
  autoplayMedia: boolean,
  autoplayNext: boolean,
  hideReposts: ?boolean,
  showNsfw: boolean,
  hideScheduledLivestreams: boolean,
  myChannelUrls: ?Array<string>,
  instantPurchaseEnabled: boolean,
  instantPurchaseMax: Price,
  enablePublishPreview: boolean,
  // --- perform ---
  setClientSetting: (string, boolean | string | number) => void,
  clearPlayingUri: () => void,
  openModal: (string) => void,
};

export default function SettingContent(props: Props) {
  const {
    isAuthenticated,
    floatingPlayer,
    autoplayMedia,
    autoplayNext,
    hideReposts,
    showNsfw,
    hideScheduledLivestreams,
    myChannelUrls,
    instantPurchaseEnabled,
    instantPurchaseMax,
    enablePublishPreview,
    setClientSetting,
    clearPlayingUri,
    openModal,
  } = props;

  return (
    <>
      <div className="card__title-section">
        <h2 className="card__title">{__('Content settings')}</h2>
      </div>
      <Card
        id={SETTINGS_GRP.CONTENT}
        isBodyList
        body={
          <>
            <SettingsRow title={__('Floating video player')} subtitle={__(HELP.FLOATING_PLAYER)}>
              <FormField
                type="checkbox"
                name="floating_player"
                onChange={() => {
                  setClientSetting(SETTINGS.FLOATING_PLAYER, !floatingPlayer);
                  clearPlayingUri();
                }}
                checked={floatingPlayer}
              />
            </SettingsRow>

            <SettingsRow title={__('Autoplay media files')} subtitle={__(HELP.AUTOPLAY_MEDIA)}>
              <FormField
                type="checkbox"
                name="autoplay media"
                onChange={() => setClientSetting(SETTINGS.AUTOPLAY_MEDIA, !autoplayMedia)}
                checked={autoplayMedia}
              />
            </SettingsRow>

            <SettingsRow title={__('Autoplay next recommended content')} subtitle={__(HELP.AUTOPLAY_NEXT)}>
              <FormField
                type="checkbox"
                name="autoplay next"
                onChange={() => setClientSetting(SETTINGS.AUTOPLAY_NEXT, !autoplayNext)}
                checked={autoplayNext}
              />
            </SettingsRow>

            <SettingsRow title={__('Hide reposts')} subtitle={__(HELP.HIDE_REPOSTS)}>
              <FormField
                type="checkbox"
                name="hide_reposts"
                checked={hideReposts}
                onChange={(e) => {
                  if (isAuthenticated) {
                    let param = e.target.checked ? { add: 'noreposts' } : { remove: 'noreposts' };
                    Lbryio.call('user_tag', 'edit', param);
                  }
                  setClientSetting(SETTINGS.HIDE_REPOSTS, !hideReposts);
                }}
              />
            </SettingsRow>

            <SettingsRow title={__('Hide Scheduled Livestreams')} subtitle={__(HELP.HIDE_SCHEDULED_LIVESTREAMS)}>
              <FormField
                type="checkbox"
                name="hide_scheduled_livestreams"
                onChange={() => setClientSetting(SETTINGS.HIDE_SCHEDULED_LIVESTREAMS, !hideScheduledLivestreams)}
                checked={hideScheduledLivestreams}
              />
            </SettingsRow>

            <SettingsRow title={__('Default Video Quality')} subtitle={__(HELP.DEFAULT_VIDEO_QUALITY)}>
              <SettingDefaultQuality />
            </SettingsRow>

            {!SIMPLE_SITE && (
              <>
                {/*
              <SettingsRow title={__('Show anonymous content')} subtitle={__('Anonymous content is published without a channel.')} >
                <FormField
                  type="checkbox"
                  name="show_anonymous"
                  onChange={() => setClientSetting(SETTINGS.SHOW_ANONYMOUS, !showAnonymous)}
                  checked={showAnonymous}
                />
              </SettingsRow>
              */}

                <SettingsRow title={__('Show mature content')} subtitle={__(HELP.SHOW_MATURE)}>
                  <FormField
                    type="checkbox"
                    name="show_nsfw"
                    checked={showNsfw}
                    onChange={() =>
                      !IS_WEB || showNsfw
                        ? setClientSetting(SETTINGS.SHOW_MATURE, !showNsfw)
                        : openModal(MODALS.CONFIRM_AGE)
                    }
                  />
                </SettingsRow>
              </>
            )}

            {(isAuthenticated || !IS_WEB) && (
              <>
                <SettingsRow title={__('Notifications')}>
                  <Button
                    button="inverse"
                    label={__('Manage')}
                    icon={ICONS.ARROW_RIGHT}
                    navigate={`/$/${PAGES.SETTINGS_NOTIFICATIONS}`}
                  />
                </SettingsRow>

                <SettingsRow title={__('Blocked and muted channels')}>
                  <Button
                    button="inverse"
                    label={__('Manage')}
                    icon={ICONS.ARROW_RIGHT}
                    navigate={`/$/${PAGES.SETTINGS_BLOCKED_MUTED}`}
                  />
                </SettingsRow>

                {myChannelUrls && myChannelUrls.length > 0 && (
                  <SettingsRow title={__('Creator settings')}>
                    <Button
                      button="inverse"
                      label={__('Manage')}
                      icon={ICONS.ARROW_RIGHT}
                      navigate={`/$/${PAGES.SETTINGS_CREATOR}`}
                    />
                  </SettingsRow>
                )}
              </>
            )}

            <SettingsRow title={__('Publish confirmation')} subtitle={__(HELP.PUBLISH_PREVIEW)}>
              <FormField
                type="checkbox"
                name="sync_toggle"
                label={__('')}
                checked={enablePublishPreview}
                onChange={() => setClientSetting(SETTINGS.ENABLE_PUBLISH_PREVIEW, !enablePublishPreview)}
              />
            </SettingsRow>

            {/* @if TARGET='app' */}
            <SettingsRow title={__('Max purchase price')} subtitle={__(HELP.MAX_PURCHASE_PRICE)} multirow>
              <MaxPurchasePrice />
            </SettingsRow>
            {/* @endif */}

            <SettingsRow title={__('Purchase and tip confirmations')} multirow>
              <FormField
                type="radio"
                name="confirm_all_purchases"
                checked={!instantPurchaseEnabled}
                label={__('Always confirm before purchasing content or tipping')}
                onChange={() => setClientSetting(SETTINGS.INSTANT_PURCHASE_ENABLED, false)}
              />
              <FormField
                type="radio"
                name="instant_purchases"
                checked={instantPurchaseEnabled}
                label={__('Only confirm purchases or tips over a certain amount')}
                helper={__(HELP.ONLY_CONFIRM_OVER_AMOUNT)}
                onChange={() => setClientSetting(SETTINGS.INSTANT_PURCHASE_ENABLED, true)}
              />
              {instantPurchaseEnabled && (
                <FormFieldPrice
                  name="confirmation_price"
                  min={0.1}
                  onChange={(newValue) => setClientSetting(SETTINGS.INSTANT_PURCHASE_MAX, newValue)}
                  price={instantPurchaseMax}
                />
              )}
            </SettingsRow>
          </>
        }
      />
    </>
  );
}

// prettier-ignore
const HELP = {
  FLOATING_PLAYER: 'Keep content playing in the corner when navigating to a different page.',
  AUTOPLAY_MEDIA: 'Autoplay video and audio files when navigating to a file.',
  AUTOPLAY_NEXT: 'Autoplay the next related item when a file (video or audio) finishes playing.',
  HIDE_REPOSTS: 'You will not see reposts by people you follow or receive email notifying about them.',
  HIDE_SCHEDULED_LIVESTREAMS: 'You will not see scheduled livestreams by people you follow on the home or following page.',
  HIDE_FYP: 'You will not see the personal recommendations in the homepage.',
  SHOW_MATURE: 'Mature content may include nudity, intense sexuality, profanity, or other adult content. By displaying mature content, you are affirming you are of legal age to view mature content in your country or jurisdiction.  ',
  MAX_PURCHASE_PRICE: 'This will prevent you from purchasing any content over a certain cost, as a safety measure.',
  ONLY_CONFIRM_OVER_AMOUNT: '', // [feel redundant. Disable for now] "When this option is chosen, LBRY won't ask you to confirm purchases or tips below your chosen amount.",
  PUBLISH_PREVIEW: 'Show preview and confirmation dialog before publishing content.',
  DEFAULT_VIDEO_QUALITY: 'Set a default quality for video playback. If the default choice is not available, the next lowest will be used when playback starts.',
};
