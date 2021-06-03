// @flow
import * as React from 'react';
import Card from 'component/common/card';
import TagsSearch from 'component/tagsSearch';
import Page from 'component/page';
import ChannelSelector from 'component/channelSelector';
import Spinner from 'component/spinner';
import { FormField } from 'component/common/form-components/form-field';
import LbcSymbol from 'component/common/lbc-symbol';
import I18nMessage from 'component/i18nMessage';

const DEBOUNCE_REFRESH_MS = 1000;

const FEATURE_IS_READY = false;

type Props = {
  activeChannelClaim: ChannelClaim,
  settingsByChannelId: { [string]: PerChannelSettings },
  fetchingCreatorSettings: boolean,
  fetchingBlockedWords: boolean,
  commentBlockWords: (ChannelClaim, Array<string>) => void,
  commentUnblockWords: (ChannelClaim, Array<string>) => void,
  fetchCreatorSettings: (Array<string>) => void,
  updateCreatorSettings: (ChannelClaim, PerChannelSettings) => void,
};

export default function SettingsCreatorPage(props: Props) {
  const {
    activeChannelClaim,
    settingsByChannelId,
    commentBlockWords,
    commentUnblockWords,
    fetchCreatorSettings,
    updateCreatorSettings,
  } = props;

  const [commentsEnabled, setCommentsEnabled] = React.useState(true);
  const [mutedWordTags, setMutedWordTags] = React.useState([]);
  const [minTipAmountComment, setMinTipAmountComment] = React.useState(0);
  const [minTipAmountSuperChat, setMinTipAmountSuperChat] = React.useState(0);
  const [slowModeMinGap, setSlowModeMinGap] = React.useState(0);
  const [lastUpdated, setLastUpdated] = React.useState(1);

  function settingsToStates(settings: PerChannelSettings) {
    if (settings.comments_enabled !== undefined) {
      setCommentsEnabled(settings.comments_enabled);
    }
    if (settings.min_tip_amount_comment !== undefined) {
      setMinTipAmountComment(settings.min_tip_amount_comment);
    }
    if (settings.min_tip_amount_super_chat !== undefined) {
      setMinTipAmountSuperChat(settings.min_tip_amount_super_chat);
    }
    if (settings.slow_mode_min_gap !== undefined) {
      setSlowModeMinGap(settings.slow_mode_min_gap);
    }
    if (settings.words) {
      const tagArray = Array.from(new Set(settings.words));
      setMutedWordTags(
        tagArray
          .filter((t) => t !== '')
          .map((x) => {
            return { name: x };
          })
      );
    }
  }

  function setSettings(newSettings: PerChannelSettings) {
    settingsToStates(newSettings);
    updateCreatorSettings(activeChannelClaim, newSettings);
    setLastUpdated(Date.now());
  }

  function addMutedWords(newTags: Array<Tag>) {
    const validatedNewTags = [];
    newTags.forEach((newTag) => {
      if (!mutedWordTags.some((tag) => tag.name === newTag.name)) {
        validatedNewTags.push(newTag);
      }
    });

    if (validatedNewTags.length !== 0) {
      setMutedWordTags([...mutedWordTags, ...validatedNewTags]);
      commentBlockWords(
        activeChannelClaim,
        validatedNewTags.map((x) => x.name)
      );
      setLastUpdated(Date.now());
    }
  }

  function removeMutedWord(tagToRemove: Tag) {
    const newMutedWordTags = mutedWordTags.slice().filter((t) => t.name !== tagToRemove.name);
    setMutedWordTags(newMutedWordTags);
    commentUnblockWords(activeChannelClaim, ['', tagToRemove.name]);
    setLastUpdated(Date.now());
  }

  // Update local states with data from API.
  React.useEffect(() => {
    if (lastUpdated !== 0 && Date.now() - lastUpdated < DEBOUNCE_REFRESH_MS) {
      // Still debouncing. Skip update.
      return;
    }

    if (activeChannelClaim && settingsByChannelId && settingsByChannelId[activeChannelClaim.claim_id]) {
      const channelSettings = settingsByChannelId[activeChannelClaim.claim_id];
      settingsToStates(channelSettings);
    }
  }, [activeChannelClaim, settingsByChannelId, lastUpdated]);

  // Re-sync list, mainly to correct any invalid settings.
  React.useEffect(() => {
    if (lastUpdated && activeChannelClaim) {
      const timer = setTimeout(() => {
        fetchCreatorSettings([activeChannelClaim.claim_id]);
      }, DEBOUNCE_REFRESH_MS);
      return () => clearTimeout(timer);
    }
  }, [lastUpdated, activeChannelClaim, fetchCreatorSettings]);

  const isBusy =
    !activeChannelClaim || !settingsByChannelId || settingsByChannelId[activeChannelClaim.claim_id] === undefined;
  const isDisabled =
    activeChannelClaim && settingsByChannelId && settingsByChannelId[activeChannelClaim.claim_id] === null;

  return (
    <Page
      noFooter
      noSideNavigation
      backout={{
        title: __('Creator settings'),
        backLabel: __('Done'),
      }}
      className="card-stack"
    >
      <ChannelSelector hideAnon />
      {isBusy && (
        <div className="main--empty">
          <Spinner />
        </div>
      )}
      {isDisabled && (
        <Card
          title={__('Settings unavailable for this channel')}
          subtitle={__("This channel isn't staking enough LBRY Credits to enable Creator Settings.")}
        />
      )}
      {!isBusy && !isDisabled && (
        <>
          <Card
            title={__('General')}
            actions={
              <>
                <FormField
                  type="checkbox"
                  name="comments_enabled"
                  label={__('Enable comments for channel.')}
                  checked={commentsEnabled}
                  onChange={() => setSettings({ comments_enabled: !commentsEnabled })}
                />
                {FEATURE_IS_READY && (
                  <FormField
                    name="slow_mode_min_gap"
                    label={__('Minimum time gap in seconds for Slow Mode in livestream chat.')}
                    min={0}
                    step={1}
                    type="number"
                    placeholder="1"
                    value={slowModeMinGap}
                    onChange={(e) => setSettings({ slow_mode_min_gap: e.target.value })}
                  />
                )}
              </>
            }
          />
          <Card
            title={__('Filter')}
            actions={
              <div className="tag--blocked-words">
                <TagsSearch
                  label={__('Muted words')}
                  labelAddNew={__('Add words')}
                  labelSuggestions={__('Suggestions')}
                  onRemove={removeMutedWord}
                  onSelect={addMutedWords}
                  disableAutoFocus
                  tagsPassedIn={mutedWordTags}
                  placeholder={__('Add words to block')}
                  hideSuggestions
                  disableControlTags
                />
              </div>
            }
          />
          {FEATURE_IS_READY && (
            <Card
              title={__('Tip')}
              actions={
                <>
                  <FormField
                    name="min_tip_amount_comment"
                    label={
                      <I18nMessage tokens={{ lbc: <LbcSymbol /> }}>Minimum %lbc% tip amount for comments</I18nMessage>
                    }
                    helper={__(
                      'Enabling a minimum amount to comment will force all comments, including livestreams, to have tips associated with them. This can help prevent spam.'
                    )}
                    className="form-field--price-amount"
                    min={0}
                    step="any"
                    type="number"
                    placeholder="1"
                    value={minTipAmountComment}
                    onChange={(e) => setSettings({ min_tip_amount_comment: parseFloat(e.target.value) })}
                  />
                  <FormField
                    name="min_tip_amount_super_chat"
                    label={
                      <I18nMessage tokens={{ lbc: <LbcSymbol /> }}>Minimum %lbc% tip amount for hyperchats</I18nMessage>
                    }
                    helper={__(
                      'Enabling a minimum amount to hyperchat will force all TIPPED comments to have this value in order to be shown. This still allows regular comments to be posted.'
                    )}
                    className="form-field--price-amount"
                    min={0}
                    step="any"
                    type="number"
                    placeholder="1"
                    value={minTipAmountSuperChat}
                    onChange={(e) => setSettings({ min_tip_amount_super_chat: parseFloat(e.target.value) })}
                  />
                </>
              }
            />
          )}
        </>
      )}
    </Page>
  );
}
