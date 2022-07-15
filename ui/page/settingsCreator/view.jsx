// @flow
import * as React from 'react';
import humanizeDuration from 'humanize-duration';
import * as ICONS from 'constants/icons';
import * as MODALS from 'constants/modal_types';
import Button from 'component/button';
import Card from 'component/common/card';
import TagsSearch from 'component/tagsSearch';
import Page from 'component/page';
import ChannelSelector from 'component/channelSelector';
import SearchChannelField from 'component/searchChannelField';
import SettingsRow from 'component/settingsRow';
import Spinner from 'component/spinner';
import { FormField } from 'component/common/form-components/form-field';
import LbcSymbol from 'component/common/lbc-symbol';
import I18nMessage from 'component/i18nMessage';
import { parseURI } from 'util/lbryURI';
import debounce from 'util/debounce';

const DEBOUNCE_REFRESH_MS = 1000;

const LBC_MAX = 21000000;
const LBC_MIN = 0;
const LBC_STEP = 1.0;

// ****************************************************************************
// ****************************************************************************

type Props = {
  activeChannelClaim: ChannelClaim,
  settingsByChannelId: { [string]: PerChannelSettings },
  fetchingCreatorSettings: boolean,
  fetchingBlockedWords: boolean,
  moderationDelegatesById: { [string]: Array<{ channelId: string, channelName: string }> },
  commentBlockWords: (ChannelClaim, Array<string>) => void,
  commentUnblockWords: (ChannelClaim, Array<string>) => void,
  commentModAddDelegate: (string, string, ChannelClaim) => void,
  commentModRemoveDelegate: (string, string, ChannelClaim) => void,
  commentModListDelegates: (ChannelClaim) => void,
  fetchCreatorSettings: (channelId: string) => void,
  updateCreatorSettings: (ChannelClaim, PerChannelSettings) => void,
  doToast: ({ message: string }) => void,
  doOpenModal: (id: string, {}) => void,
};

export default function SettingsCreatorPage(props: Props) {
  const {
    activeChannelClaim,
    settingsByChannelId,
    moderationDelegatesById,
    commentBlockWords,
    commentUnblockWords,
    commentModAddDelegate,
    commentModRemoveDelegate,
    commentModListDelegates,
    fetchCreatorSettings,
    updateCreatorSettings,
    doOpenModal,
  } = props;

  const [commentsEnabled, setCommentsEnabled] = React.useState(true);
  const [mutedWordTags, setMutedWordTags] = React.useState([]);
  const [moderatorUris, setModeratorUris] = React.useState([]);
  const [minTip, setMinTip] = React.useState(0);
  const [minSuper, setMinSuper] = React.useState(0);
  const [slowModeMin, setSlowModeMin] = React.useState(0);
  const [minChannelAgeMinutes, setMinChannelAgeMinutes] = React.useState(0);
  const [lastUpdated, setLastUpdated] = React.useState(1);

  const pushSlowModeMinDebounced = React.useMemo(() => debounce(pushSlowModeMin, 1000), []); // eslint-disable-line react-hooks/exhaustive-deps
  const pushMinTipDebounced = React.useMemo(() => debounce(pushMinTip, 1000), []); // eslint-disable-line react-hooks/exhaustive-deps
  const pushMinSuperDebounced = React.useMemo(() => debounce(pushMinSuper, 1000), []); // eslint-disable-line react-hooks/exhaustive-deps

  // **************************************************************************
  // **************************************************************************

  /**
   * Updates corresponding GUI states with the given PerChannelSettings values.
   *
   * @param settings
   * @param fullSync If true, update all states and consider 'undefined'
   *   settings as "cleared/false"; if false, only update defined settings.
   */
  function settingsToStates(settings: PerChannelSettings, fullSync: boolean) {
    const doSetMutedWordTags = (words: Array<string>) => {
      const tagArray = Array.from(new Set(words));
      setMutedWordTags(
        tagArray
          .filter((t) => t !== '')
          .map((x) => {
            return { name: x };
          })
      );
    };

    if (fullSync) {
      setCommentsEnabled(settings.comments_enabled || false);
      setMinTip(settings.min_tip_amount_comment || 0);
      setMinSuper(settings.min_tip_amount_super_chat || 0);
      setSlowModeMin(settings.slow_mode_min_gap || 0);
      setMinChannelAgeMinutes(settings.time_since_first_comment || 0);
      doSetMutedWordTags(settings.words || []);
    } else {
      if (settings.comments_enabled !== undefined) {
        setCommentsEnabled(settings.comments_enabled);
      }
      if (settings.min_tip_amount_comment !== undefined) {
        setMinTip(settings.min_tip_amount_comment);
      }
      if (settings.min_tip_amount_super_chat !== undefined) {
        setMinSuper(settings.min_tip_amount_super_chat);
      }
      if (settings.slow_mode_min_gap !== undefined) {
        setSlowModeMin(settings.slow_mode_min_gap);
      }
      if (settings.time_since_first_comment) {
        setMinChannelAgeMinutes(settings.time_since_first_comment);
      }
      if (settings.words) {
        doSetMutedWordTags(settings.words);
      }
    }
  }

  function setSettings(newSettings: PerChannelSettings) {
    settingsToStates(newSettings, false);
    updateCreatorSettings(activeChannelClaim, newSettings);
    setLastUpdated(Date.now());
  }

  function pushSlowModeMin(value: number, activeChannelClaim: ChannelClaim) {
    updateCreatorSettings(activeChannelClaim, { slow_mode_min_gap: value });
  }

  function pushMinTip(value: number, activeChannelClaim: ChannelClaim) {
    updateCreatorSettings(activeChannelClaim, { min_tip_amount_comment: value });
  }

  function pushMinSuper(value: number, activeChannelClaim: ChannelClaim) {
    updateCreatorSettings(activeChannelClaim, { min_tip_amount_super_chat: value });
  }

  function parseModUri(uri) {
    try {
      return parseURI(uri);
    } catch (e) {}
    return undefined;
  }

  function handleModeratorAdded(channelUri: string) {
    setModeratorUris([...moderatorUris, channelUri]);
    const parsedUri = parseModUri(channelUri);
    if (parsedUri && parsedUri.claimId && parsedUri.claimName) {
      commentModAddDelegate(parsedUri.claimId, parsedUri.claimName, activeChannelClaim);
      setLastUpdated(Date.now());
    }
  }

  function handleModeratorRemoved(channelUri: string) {
    setModeratorUris(moderatorUris.filter((x) => x !== channelUri));
    const parsedUri = parseModUri(channelUri);
    if (parsedUri && parsedUri.claimId && parsedUri.claimName) {
      commentModRemoveDelegate(parsedUri.claimId, parsedUri.claimName, activeChannelClaim);
      setLastUpdated(Date.now());
    }
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

  // **************************************************************************
  // **************************************************************************

  // Update local moderator states with data from API.
  React.useEffect(() => {
    commentModListDelegates(activeChannelClaim);
  }, [activeChannelClaim, commentModListDelegates]);

  React.useEffect(() => {
    if (activeChannelClaim) {
      const delegates = moderationDelegatesById[activeChannelClaim.claim_id];
      if (delegates) {
        setModeratorUris(delegates.map((d) => `${d.channelName}#${d.channelId}`));
      } else {
        setModeratorUris([]);
      }
    }
  }, [activeChannelClaim, moderationDelegatesById]);

  // Update local states with data from API.
  React.useEffect(() => {
    if (lastUpdated !== 0 && Date.now() - lastUpdated < DEBOUNCE_REFRESH_MS) {
      // Still debouncing. Skip update.
      return;
    }

    if (activeChannelClaim && settingsByChannelId && settingsByChannelId[activeChannelClaim.claim_id]) {
      const channelSettings = settingsByChannelId[activeChannelClaim.claim_id];
      settingsToStates(channelSettings, true);
    }
  }, [activeChannelClaim, settingsByChannelId, lastUpdated]);

  // Re-sync list on first idle time; mainly to correct any invalid settings.
  React.useEffect(() => {
    if (lastUpdated && activeChannelClaim) {
      const timer = setTimeout(() => {
        fetchCreatorSettings(activeChannelClaim.claim_id);
      }, DEBOUNCE_REFRESH_MS);
      return () => clearTimeout(timer);
    }
  }, [lastUpdated, activeChannelClaim, fetchCreatorSettings]);

  // **************************************************************************
  // **************************************************************************

  const isBusy =
    !activeChannelClaim || !settingsByChannelId || settingsByChannelId[activeChannelClaim.claim_id] === undefined;
  const isDisabled =
    activeChannelClaim && settingsByChannelId && settingsByChannelId[activeChannelClaim.claim_id] === null;

  return (
    <Page
      noFooter
      noSideNavigation
      settingsPage
      backout={{ title: __('Creator settings'), backLabel: __('Back') }}
      className="card-stack"
    >
      <div className="card-stack">
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
              isBodyList
              body={
                <>
                  <SettingsRow title={__('Enable comments for channel.')}>
                    <FormField
                      type="checkbox"
                      name="comments_enabled"
                      checked={commentsEnabled}
                      onChange={() => setSettings({ comments_enabled: !commentsEnabled })}
                    />
                  </SettingsRow>

                  <SettingsRow title={__('Slow mode')} subtitle={__(HELP.SLOW_MODE)}>
                    <FormField
                      name="slow_mode_min_gap"
                      min={0}
                      step={1}
                      type="number"
                      placeholder="1"
                      value={slowModeMin}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        setSlowModeMin(value);
                        pushSlowModeMinDebounced(value, activeChannelClaim);
                      }}
                      onBlur={() => setLastUpdated(Date.now())}
                    />
                  </SettingsRow>

                  <SettingsRow title={__('Minimum channel age for comments')} subtitle={__(HELP.CHANNEL_AGE)}>
                    <div className="section__actions">
                      <FormField
                        name="time_since_first_comment"
                        className="form-field--copyable"
                        disabled={minChannelAgeMinutes <= 0}
                        type="text"
                        readOnly
                        value={
                          minChannelAgeMinutes > 0
                            ? humanizeDuration(minChannelAgeMinutes * 60 * 1000, { round: true })
                            : __('No limit')
                        }
                        inputButton={
                          <Button
                            button="secondary"
                            icon={ICONS.EDIT}
                            title={__('Change')}
                            onClick={() => {
                              doOpenModal(MODALS.MIN_CHANNEL_AGE, {
                                onConfirm: (limitInMinutes: number, closeModal: () => void) => {
                                  setMinChannelAgeMinutes(limitInMinutes);
                                  updateCreatorSettings(activeChannelClaim, {
                                    time_since_first_comment: limitInMinutes,
                                  });
                                  closeModal();
                                },
                              });
                            }}
                          />
                        }
                      />
                    </div>
                  </SettingsRow>

                  <SettingsRow
                    title={
                      <I18nMessage tokens={{ lbc: <LbcSymbol /> }}>Minimum %lbc% tip amount for comments</I18nMessage>
                    }
                    subtitle={__(HELP.MIN_TIP)}
                  >
                    <FormField
                      name="min_tip_amount_comment"
                      className="form-field--price-amount"
                      max={LBC_MAX}
                      min={LBC_MIN}
                      step={LBC_STEP}
                      type="number"
                      placeholder="1"
                      value={minTip}
                      onChange={(e) => {
                        const newMinTip = parseFloat(e.target.value);
                        setMinTip(newMinTip);
                        pushMinTipDebounced(newMinTip, activeChannelClaim);
                        if (newMinTip !== 0 && minSuper !== 0) {
                          setMinSuper(0);
                          pushMinSuperDebounced(0, activeChannelClaim);
                        }
                      }}
                      onBlur={() => setLastUpdated(Date.now())}
                    />
                  </SettingsRow>

                  <SettingsRow
                    title={
                      <I18nMessage tokens={{ lbc: <LbcSymbol /> }}>Minimum %lbc% tip amount for hyperchats</I18nMessage>
                    }
                    subtitle={
                      <>
                        {__(HELP.MIN_SUPER)}
                        {minTip !== 0 && (
                          <p className="help--inline">
                            <em>{__(HELP.MIN_SUPER_OFF)}</em>
                          </p>
                        )}
                      </>
                    }
                  >
                    <FormField
                      name="min_tip_amount_super_chat"
                      className="form-field--price-amount"
                      min={0}
                      step="any"
                      type="number"
                      placeholder="1"
                      value={minSuper}
                      disabled={minTip !== 0}
                      onChange={(e) => {
                        const newMinSuper = parseFloat(e.target.value);
                        setMinSuper(newMinSuper);
                        pushMinSuperDebounced(newMinSuper, activeChannelClaim);
                      }}
                      onBlur={() => setLastUpdated(Date.now())}
                    />
                  </SettingsRow>

                  <SettingsRow title={__('Moderators')} subtitle={__(HELP.MODERATORS)} multirow>
                    <SearchChannelField
                      label={__('Moderators')}
                      labelAddNew={__('Add moderator')}
                      labelFoundAction={__('Add')}
                      values={moderatorUris}
                      onAdd={handleModeratorAdded}
                      onRemove={handleModeratorRemoved}
                    />
                  </SettingsRow>

                  <SettingsRow title={__('Filter')} subtitle={__(HELP.BLOCKED_WORDS)} multirow>
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
                  </SettingsRow>
                </>
              }
            />
          </>
        )}
      </div>
    </Page>
  );
}

// prettier-ignore
const HELP = {
  SLOW_MODE: 'Minimum time gap in seconds between comments (affects livestream chat as well).',
  CHANNEL_AGE: 'Channels with a lifespan lower than the specified duration will not be able to comment on your content.',
  MIN_TIP: 'Enabling a minimum amount to comment will force all comments, including livestreams, to have tips associated with them. This can help prevent spam.',
  MIN_SUPER: 'Enabling a minimum amount to hyperchat will force all TIPPED comments to have this value in order to be shown. This still allows regular comments to be posted.',
  MIN_SUPER_OFF: '(This settings is not applicable if all comments require a tip.)',
  BLOCKED_WORDS: 'Comments and livestream chat containing these words will be blocked.',
  MODERATORS: 'Moderators can block channels on your behalf. Blocked channels will appear in your "Blocked and Muted" list.',
  MODERATOR_SEARCH: 'Enter a channel name or URL to add as a moderator.\nExamples:\n - @channel\n - @channel#3\n - https://odysee.com/@Odysee:8\n - lbry://@Odysee#8',
};
