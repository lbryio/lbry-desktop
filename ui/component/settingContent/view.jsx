// @flow
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import React from 'react';
import { SETTINGS } from 'lbry-redux';
import { Lbryio } from 'lbryinc';
import { SIMPLE_SITE } from 'config';
import * as MODALS from 'constants/modal_types';
import Button from 'component/button';
import Card from 'component/common/card';
import { FormField, FormFieldPrice } from 'component/common/form';
import MaxPurchasePrice from 'component/maxPurchasePrice';
import SettingsRow from 'component/settingsRow';

type Price = {
  currency: string,
  amount: number,
};

type Props = {
  // --- select ---
  isAuthenticated: boolean,
  floatingPlayer: boolean,
  autoplay: boolean,
  hideReposts: ?boolean,
  showNsfw: boolean,
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
    autoplay,
    hideReposts,
    showNsfw,
    myChannelUrls,
    instantPurchaseEnabled,
    instantPurchaseMax,
    enablePublishPreview,
    setClientSetting,
    clearPlayingUri,
    openModal,
  } = props;

  return (
    <Card
      title={__('Content settings')}
      subtitle=""
      isBodyList
      body={
        <>
          <SettingsRow title={__('Floating video player')} subtitle={__(HELP_FLOATING_PLAYER)}>
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

          <SettingsRow title={__('Autoplay media files')} subtitle={__(HELP_AUTOPLAY)}>
            <FormField
              type="checkbox"
              name="autoplay"
              onChange={() => setClientSetting(SETTINGS.AUTOPLAY, !autoplay)}
              checked={autoplay}
            />
          </SettingsRow>

          {!SIMPLE_SITE && (
            <>
              <SettingsRow title={__('Hide reposts')} subtitle={__(HELP_HIDE_REPOSTS)}>
                <FormField
                  type="checkbox"
                  name="hide_reposts"
                  onChange={(e) => {
                    if (isAuthenticated) {
                      let param = e.target.checked ? { add: 'noreposts' } : { remove: 'noreposts' };
                      Lbryio.call('user_tag', 'edit', param);
                    }
                    setClientSetting(SETTINGS.HIDE_REPOSTS, !hideReposts);
                  }}
                />
              </SettingsRow>

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

              <SettingsRow title={__('Show mature content')} subtitle={__(HELP_SHOW_MATURE)}>
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
                  button="secondary"
                  label={__('Manage')}
                  icon={ICONS.SETTINGS}
                  navigate={`/$/${PAGES.SETTINGS_NOTIFICATIONS}`}
                />
              </SettingsRow>

              <SettingsRow title={__('Blocked and muted channels')}>
                <Button
                  button="secondary"
                  label={__('Manage')}
                  icon={ICONS.SETTINGS}
                  navigate={`/$/${PAGES.SETTINGS_BLOCKED_MUTED}`}
                />
              </SettingsRow>

              {myChannelUrls && myChannelUrls.length > 0 && (
                <SettingsRow title={__('Creator settings')}>
                  <Button
                    button="secondary"
                    label={__('Manage')}
                    icon={ICONS.SETTINGS}
                    navigate={`/$/${PAGES.SETTINGS_CREATOR}`}
                  />
                </SettingsRow>
              )}
            </>
          )}

          <SettingsRow title={__('Publish confirmation')} subtitle={__('Skip preview and confirmation')}>
            <FormField
              type="checkbox"
              name="sync_toggle"
              label={__('')}
              checked={!enablePublishPreview}
              onChange={() => setClientSetting(SETTINGS.ENABLE_PUBLISH_PREVIEW, !enablePublishPreview)}
            />
          </SettingsRow>

          {/* @if TARGET='app' */}
          <SettingsRow title={__('Max purchase price')} subtitle={__(HELP_MAX_PURCHASE_PRICE)} useVerticalSeparator>
            <MaxPurchasePrice />
          </SettingsRow>
          {/* @endif */}

          <SettingsRow title={__('Purchase and tip confirmations')} useVerticalSeparator>
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
              helper={__(HELP_ONLY_CONFIRM_OVER_AMOUNT)}
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
  );
}

const HELP_FLOATING_PLAYER = 'Keep content playing in the corner when navigating to a different page.';
const HELP_AUTOPLAY =
  'Autoplay video and audio files when navigating to a file, as well as the next related item when a file finishes playing.';
const HELP_HIDE_REPOSTS = 'You will not see reposts by people you follow or receive email notifying about them.';
const HELP_SHOW_MATURE =
  'Mature content may include nudity, intense sexuality, profanity, or other adult content. By displaying mature content, you are affirming you are of legal age to view mature content in your country or jurisdiction.  ';
const HELP_MAX_PURCHASE_PRICE =
  'This will prevent you from purchasing any content over a certain cost, as a safety measure.';
const HELP_ONLY_CONFIRM_OVER_AMOUNT = ''; // feel redundant. Disable for now.
// const HELP_ONLY_CONFIRM_OVER_AMOUNT = "When this option is chosen, LBRY won't ask you to confirm purchases or tips below your chosen amount.";
