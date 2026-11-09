import {EMOTES_48px as EMOTES} from 'constants/emotes';
import { matchSorter } from 'match-sorter';
import { SEARCH_OPTIONS } from 'constants/search';
import * as KEYCODES from 'constants/keycodes';
import Autocomplete from '@mui/material/Autocomplete';
import BusyIndicator from 'component/common/busy-indicator';
import EMOJIS from 'emoji-dictionary';
import LbcSymbol from 'component/common/lbc-symbol';
import Popper from '@mui/material/Popper';
import React from 'react';
import TextareaSuggestionsItem from 'component/textareaSuggestionsItem';
import TextField from '@mui/material/TextField';
import useLighthouse from 'effects/use-lighthouse';
import useThrottle from 'effects/use-throttle';

const SUGGESTION_REGEX = new RegExp(
  '(?<Mention>(?:^| |\n)@[^\\s=&#$@%?:;/\\"<>%{}|^~[]*(?::[\\w]+)?)|(?<Emote>(?:^| |\n):[\\w+-]*:?)',
  'gm'
);

/** Regex Explained step-by-step:
 *
 * 1) (?<Name>....) = naming a match into a possible group (either Mention or Emote)
 * 2) (?:^| |\n) = only allow for: sentence beginning, space or newline before the match (no words or symbols)
 * 3) [^\s=&#$@%?:;/\\"<>%{}|^~[]* = anything, except the characters inside
 * 4) (?::[\w]+)? = A mention can be matched with a ':' as a claim modifier with words or digits after as ID digits,
 * or else it's everything before the ':' (will then match the winning uri for the mention behind since has no canonical ID)
 * 5) :\w*:? = the emote Regex, possible to be matched with a ':' at the end to consider previously typed emotes
 *
 */

const SEARCH_SIZE = 10;
const LIGHTHOUSE_MIN_CHARACTERS = 3;
const INPUT_DEBOUNCE_MS = 1000;

const EMOJI_MIN_CHARACTERS = 2;

type Props = {
  canonicalCommentors?: Array<string>,
  canonicalCreatorUri?: string,
  canonicalSearch?: Array<string>,
  canonicalSubscriptions?: Array<string>,
  canonicalTop?: string,
  className?: string,
  commentorUris?: Array<string>,
  disabled?: boolean,
  hasNewResolvedResults?: boolean,
  id: string,
  inputRef: any,
  isLivestream?: boolean,
  maxLength?: number,
  placeholder?: string,
  searchQuery?: string,
  showMature: boolean,
  type?: string,
  uri?: string,
  value: any,
  doResolveUris: (arg1: Array<string>) => void,
  doSetMentionSearchResults: (arg1: string, arg2: Array<string>) => void,
  onBlur: (arg1?: any) => any,
  onChange: (arg1?: any) => any,
  onFocus: (arg1?: any) => any
};

export default function TextareaWithSuggestions(props: Props) {
  const {
    canonicalCommentors,
    canonicalCreatorUri,
    canonicalSearch,
    canonicalSubscriptions: canonicalSubs,
    canonicalTop,
    className,
    commentorUris,
    disabled,
    hasNewResolvedResults,
    id,
    inputRef,
    isLivestream,
    maxLength,
    placeholder,
    searchQuery,
    showMature,
    type,
    value: messageValue,
    doResolveUris,
    doSetMentionSearchResults,
    onBlur,
    onChange,
    onFocus,
  } = props;

  const inputDefaultProps = { className, placeholder, maxLength, type, disabled } as const;

  const [suggestionValue, setSuggestionValue] = React.useState<any>(undefined);
  const [highlightedSuggestion, setHighlightedSuggestion] = React.useState('');
  const [shouldClose, setClose] = React.useState<any>();
  const [debouncedTerm, setDebouncedTerm] = React.useState('');

  const suggestionTerm = suggestionValue && suggestionValue.term;
  const isEmote = suggestionValue && suggestionValue.isEmote;
  const isMention = suggestionValue && !suggestionValue.isEmote;
  const invalidTerm = suggestionTerm && isMention && suggestionTerm.charAt(1) === ':';

  const additionalOptions = { isBackgroundSearch: false, [SEARCH_OPTIONS.CLAIM_TYPE]: SEARCH_OPTIONS.INCLUDE_CHANNELS } as const;
  const { results, loading } = useLighthouse(debouncedTerm, showMature, SEARCH_SIZE, additionalOptions, 0);
  const stringifiedResults = JSON.stringify(results);

  const hasMinLength = suggestionTerm && isMention && suggestionTerm.length >= LIGHTHOUSE_MIN_CHARACTERS;
  const isTyping = isMention && debouncedTerm !== suggestionTerm;
  const showPlaceholder =
    isMention && !invalidTerm && (isTyping || loading || (results && results.length > 0 && !hasNewResolvedResults));

// @ts-expect-error - TS2339 - Property 'includes' does not exist on type 'unknown'.
  const shouldFilter = (uri: unknown, previous: unknown) => uri !== canonicalCreatorUri && (!previous || !previous.includes(uri));
// @ts-expect-error - TS2554 - Expected 2 arguments, but got 1.
  const filteredCommentors = canonicalCommentors && canonicalCommentors.filter((uri) => shouldFilter(uri));
  const filteredSubs = canonicalSubs && canonicalSubs.filter((uri) => shouldFilter(uri, filteredCommentors));
  const filteredTop =
    canonicalTop &&
    shouldFilter(canonicalTop, filteredSubs) &&
    shouldFilter(canonicalTop, filteredCommentors) &&
    canonicalTop;
  const filteredSearch =
    canonicalSearch &&
    canonicalSearch.filter(
      (uri) => shouldFilter(uri, filteredSubs) && shouldFilter(uri, filteredCommentors) && uri !== filteredTop
    );

  let emoteNames;
  let emojiNames;
  const allOptions: unknown = [];
  if (isEmote) {
    emoteNames = EMOTES.map(({ name }) => name.toLowerCase());
    const hasMinEmojiLength = suggestionTerm && suggestionTerm.length > EMOJI_MIN_CHARACTERS;
    // Filter because our emotes are priority from default emojis, like :eggplant:
    emojiNames = hasMinEmojiLength ? EMOJIS.names.filter((name) => !emoteNames.includes(`:${name}:`)) : [];
    const emotesAndEmojis = [...emoteNames, ...emojiNames];

// @ts-expect-error - TS2339 - Property 'push' does not exist on type 'unknown'.
    allOptions.push(...emotesAndEmojis);
  } else {
// @ts-expect-error - TS2339 - Property 'push' does not exist on type 'unknown'.
    if (canonicalCreatorUri) allOptions.push(canonicalCreatorUri);
// @ts-expect-error - TS2339 - Property 'push' does not exist on type 'unknown'.
    if (filteredSubs) allOptions.push(...filteredSubs);
// @ts-expect-error - TS2339 - Property 'push' does not exist on type 'unknown'.
    if (filteredCommentors) allOptions.push(...filteredCommentors);
// @ts-expect-error - TS2339 - Property 'push' does not exist on type 'unknown'.
    if (filteredTop) allOptions.push(filteredTop);
// @ts-expect-error - TS2339 - Property 'push' does not exist on type 'unknown'.
    if (filteredSearch) allOptions.push(...filteredSearch);
  }

  const allOptionsGrouped =
// @ts-expect-error - TS2339 - Property 'length' does not exist on type 'unknown'.
    allOptions.length > 0
// @ts-expect-error - TS2339 - Property 'map' does not exist on type 'unknown'.
      ? allOptions.map((option) => {
          const groupName = isEmote
            ? (emoteNames.includes(option) && __('Emotes')) || (emojiNames.includes(option) && __('Emojis'))
            : (canonicalCreatorUri === option && __('Creator')) ||
              (filteredSubs && filteredSubs.includes(option) && __('Following')) ||
              (filteredCommentors && filteredCommentors.includes(option) && __('From Comments')) ||
              (filteredTop && filteredTop === option && 'Top') ||
              (filteredSearch && filteredSearch.includes(option) && __('From Search'));

          let emoteLabel;
          if (isEmote) {
            emoteLabel = `:${option.replaceAll(':', '')}:`;
          }

          return {
            label: emoteLabel || option.replace('lbry://', '').replace('#', ':'),
            group: groupName,
          };
        })
      : [];

  const allMatches =
    useSuggestionMatch(
      suggestionTerm || '',
      allOptionsGrouped.map(({ label }) => label)
    ) || [];

  /** --------- **/
  /** Functions **/
  /** --------- **/

  function handleInputChange(value: string) {
    onChange({ target: { value } });

    const cursorIndex = inputRef && inputRef.current && inputRef.current.selectionStart;

    const suggestionMatches = value.match(SUGGESTION_REGEX);

    if (!suggestionMatches) {
      if (suggestionValue) setSuggestionValue(null);
      return; // Exit here and avoid unnecessary behavior
    }

    const exec = SUGGESTION_REGEX.exec(value);
    const groups = exec && exec.groups;
    const groupValue = groups && Object.keys(groups).find((group) => groups[group]);

    const previousLastIndexes: unknown = [];
    let isEmote = groupValue && groupValue === 'Emote';
    let currentSuggestionIndex = exec && exec.index;
    let currentLastIndex = exec && SUGGESTION_REGEX.lastIndex;
    let currentSuggestionValue =
      cursorIndex >= currentSuggestionIndex &&
      cursorIndex <= currentLastIndex &&
      suggestionMatches &&
      suggestionMatches[0];

    if (suggestionMatches && suggestionMatches.length > 1) {
      currentSuggestionValue = suggestionMatches.find((match, index) => {
        const previousLastIndex = previousLastIndexes[index - 1] || 0;
        const valueWithoutPrevious = value.substring(previousLastIndex);

        const tempRe = new RegExp(SUGGESTION_REGEX);
        const tempExec = tempRe.exec(valueWithoutPrevious);
        const groups = tempExec && tempExec.groups;
        const groupValue = groups && Object.keys(groups).find((group) => groups[group]);

        if (tempExec) {
          isEmote = groupValue && groupValue === 'Emote';
          currentSuggestionIndex = previousLastIndex + tempExec.index;
          currentLastIndex = previousLastIndex + tempRe.lastIndex;
// @ts-expect-error - TS2339 - Property 'push' does not exist on type 'unknown'.
          previousLastIndexes.push(currentLastIndex);
        }

        // the current mention term will be the one on the text cursor's range,
        // in case of there being more in the same comment message
        if (previousLastIndexes) {
          return cursorIndex >= currentSuggestionIndex && cursorIndex <= currentLastIndex;
        }
      });
    }

    if (currentSuggestionValue) {
      const token = isEmote ? ':' : '@';
      const tokenIndex = currentSuggestionValue.indexOf(token);

      setSuggestionValue({
        beforeTerm: currentSuggestionValue.substring(0, tokenIndex), // in case of a space or newline
        term: currentSuggestionValue.substring(tokenIndex),
        index: currentSuggestionIndex,
        lastIndex: currentLastIndex,
        isEmote,
      });
    } else if (suggestionValue) {
      setSuggestionValue(null);
    }
  }

  const handleSelect = React.useCallback(
    (selectedValue: string) => {
      if (!suggestionValue) return;

      const elem = inputRef && inputRef.current;
      const newCursorPos = suggestionValue.beforeTerm.length + suggestionValue.index + selectedValue.length + 1;

      const contentBegin = messageValue.substring(0, suggestionValue.index);
      const replaceValue = suggestionValue.beforeTerm + selectedValue;
      const contentEnd =
        messageValue.length > suggestionValue.lastIndex
          ? messageValue.substring(suggestionValue.lastIndex, messageValue.length)
          : ' ';

      const newValue = contentBegin + replaceValue + contentEnd;

      onChange({ target: { value: newValue } });
      setSuggestionValue(null);
      elem.focus();
      elem.setSelectionRange(newCursorPos, newCursorPos);
    },
    [messageValue, inputRef, onChange, suggestionValue]
  );

  /** ------- **/
  /** Effects **/
  /** ------- **/

  React.useEffect(() => {
    if (!isMention) return;

    if (isTyping && suggestionTerm && !invalidTerm) {
      const timer = setTimeout(() => {
        setDebouncedTerm(!hasMinLength ? '' : suggestionTerm);
      }, INPUT_DEBOUNCE_MS);

      return () => clearTimeout(timer);
    }
  }, [hasMinLength, invalidTerm, isMention, isTyping, suggestionTerm]);

  React.useEffect(() => {
    if (!stringifiedResults) return;

    const arrayResults = JSON.parse(stringifiedResults);
    if (debouncedTerm && arrayResults && arrayResults.length > 0) {
      doResolveUris([debouncedTerm, ...arrayResults]);
      doSetMentionSearchResults(debouncedTerm, arrayResults);
    }
  }, [debouncedTerm, doResolveUris, doSetMentionSearchResults, stringifiedResults, suggestionTerm]);

  // Disable sending on Enter on Livestream chat
  React.useEffect(() => {
    if (!isLivestream) return;

    if (suggestionTerm && inputRef) {
      inputRef.current.setAttribute('term', suggestionTerm);
    } else {
      inputRef.current.removeAttribute('term');
    }
  }, [inputRef, isLivestream, suggestionTerm]);

  // Only resolve commentors on Livestreams when first trying to mention/looking for it
  React.useEffect(() => {
    if (isLivestream && commentorUris && suggestionTerm) doResolveUris(commentorUris);
  }, [commentorUris, doResolveUris, isLivestream, suggestionTerm]);

  // Allow selecting with TAB key
  React.useEffect(() => {
    if (!suggestionTerm) return; // only if there is a term, or else can't tab to navigate page

    function handleKeyDown(e: React.KeyboardEvent<any>) {
      const { keyCode } = e;

      if (highlightedSuggestion && keyCode === KEYCODES.TAB) {
        e.preventDefault();
// @ts-expect-error - TS2339 - Property 'label' does not exist on type 'string'.
        handleSelect(highlightedSuggestion.label);
      }
    }

// @ts-expect-error - TS2769 - No overload matches this call.
    window.addEventListener('keydown', handleKeyDown);

// @ts-expect-error - TS2769 - No overload matches this call.
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSelect, highlightedSuggestion, suggestionTerm]);

  /** ------ **/
  /** Render **/
  /** ------ **/

  const renderGroup = (groupName: string, children: any) => (
    <div key={groupName} className="textareaSuggestions__group">
      <label className="textareaSuggestions__label">
        {groupName === 'Top' ? (
          <LbcSymbol prefix={__('Winning Search for %matching_term%', { matching_term: searchQuery })} />
        ) : suggestionTerm && suggestionTerm.length > 1 ? (
          __('%group_name% matching %matching_term%', { group_name: groupName, matching_term: suggestionTerm })
        ) : (
          groupName
        )}
      </label>
      {children}
      <hr className="textareaSuggestions__topSeparator" />
    </div>
  );

  const renderInput = (params: any) => {
    const { InputProps, disabled, fullWidth, id, inputProps: autocompleteInputProps } = params;
    const inputProps = { ...autocompleteInputProps, ...inputDefaultProps } as const;
    const autocompleteProps = { InputProps, disabled, fullWidth, id, inputProps } as const;

    return <TextField inputRef={inputRef} multiline select={false} {...autocompleteProps} />;
  };

  const renderOption = (optionProps: any, label: string) => {
    const emoteFound = isEmote && EMOTES.find(({ name }) => name.toLowerCase() === label);
    const emoteValue = emoteFound ? { name: label, url: emoteFound.url } : undefined;
    const emojiFound = isEmote && EMOJIS.getUnicode(label);
    const emojiValue = emojiFound ? { name: label, unicode: emojiFound } : undefined;

    return <TextareaSuggestionsItem key={label} uri={label} emote={emoteValue || emojiValue} {...optionProps} />;
  };

  return (
    <Autocomplete
      PopperComponent={AutocompletePopper}
      autoHighlight
      disableClearable
      filterOptions={(options) => options.filter(({ label }) => allMatches.includes(label))}
      freeSolo
      fullWidth
      // @ts-expect-error - TS2339 (ts-migration)
      getOptionLabel={(option) => option.label || ''}
      // @ts-expect-error - TS2339 (ts-migration)
      groupBy={(option) => option.group}
      id={id}
      inputValue={messageValue}
      loading={allMatches.length === 0 || showPlaceholder}
      loadingText={showPlaceholder ? <BusyIndicator message={__('Searching...')} /> : __('Nothing found')}
      onBlur={() => onBlur && onBlur()}
      /* Different from onInputChange, onChange is only used for the selected value,
        so here it is acting simply as a selection handler (see it as onSelect) */
      // @ts-expect-error - TS2339 (ts-migration)
      onChange={(event, value) => handleSelect(value.label)}
      onClose={(event, reason) => reason !== 'selectOption' && setClose(true)}
      onFocus={() => onFocus && onFocus()}
      // @ts-expect-error - TS2345 (ts-migration)
      onHighlightChange={(event, option) => setHighlightedSuggestion(option)}
      onInputChange={(event, value, reason) => reason === 'input' && handleInputChange(value)}
      onOpen={() => suggestionTerm && setClose(false)}
      /* 'open' is for the popper box component, set to check for a valid term
        or else it will be displayed all the time as empty (no options) */
      open={!!suggestionTerm && !shouldClose}
      options={allOptionsGrouped}
      renderGroup={({ group, children }) => renderGroup(group, children)}
      renderInput={(params) => renderInput(params)}
      // @ts-expect-error - TS2339 (ts-migration)
      renderOption={(optionProps, option) => renderOption(optionProps, option.label)}
    />
  );
}

function AutocompletePopper(props: any) {
  return <Popper {...props} placement="top" />;
}

function useSuggestionMatch(term: string, list: Array<string>) {
  const throttledTerm = useThrottle(term);

  return React.useMemo(() => {
    return !throttledTerm || throttledTerm.trim() === ''
      ? undefined
      // @ts-expect-error - TS2322 (ts-migration)
      : matchSorter(list, term, { keys: [(item: unknown) => item] });
  }, [list, term, throttledTerm]);
}
