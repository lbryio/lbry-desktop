// @flow
import { EMOTES_48px as EMOTES } from 'constants/emotes';
import { matchSorter } from 'match-sorter';
import * as KEYCODES from 'constants/keycodes';
import Autocomplete from '@mui/material/Autocomplete';
import React from 'react';
import TextareaSuggestionsItem from 'component/textareaSuggestionsItem';
import TextField from '@mui/material/TextField';
import useThrottle from 'effects/use-throttle';

const SUGGESTION_REGEX = new RegExp(
  '(?<Mention>(?:^| |\n)@[^\\s=&#$@%?:;/\\"<>%{}|^~[]*(?::[\\w]+)?)|(?<Emote>(?:^| |\n):[\\w]*:?)',
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

type Props = {
  canonicalCommentors?: Array<string>,
  canonicalCreatorUri?: string,
  canonicalSubscriptions?: Array<string>,
  className?: string,
  commentorUris?: Array<string>,
  disabled?: boolean,
  id: string,
  inputRef: any,
  isLivestream?: boolean,
  maxLength?: number,
  placeholder?: string,
  type?: string,
  uri?: string,
  value: any,
  doResolveUris: (Array<string>) => void,
  onBlur: (any) => any,
  onChange: (any) => any,
  onFocus: (any) => any,
};

export default function TextareaWithSuggestions(props: Props) {
  const {
    canonicalCommentors,
    canonicalCreatorUri,
    canonicalSubscriptions: canonicalSubs,
    className,
    commentorUris,
    disabled,
    id,
    inputRef,
    isLivestream,
    maxLength,
    placeholder,
    type,
    value: messageValue,
    doResolveUris,
    onBlur,
    onChange,
    onFocus,
  } = props;

  const inputDefaultProps = { className, placeholder, maxLength, type, disabled };

  const [suggestionValue, setSuggestionValue] = React.useState(undefined);
  const [selectedValue, setSelectedValue] = React.useState(undefined);
  const [highlightedSuggestion, setHighlightedSuggestion] = React.useState('');
  const [shouldClose, setClose] = React.useState();

  const suggestionTerm = suggestionValue && suggestionValue.term;
  const isEmote = suggestionValue && suggestionValue.isEmote;

  const shouldFilter = (uri, previous) => uri !== canonicalCreatorUri && (!previous || !previous.includes(uri));
  const filteredCommentors = canonicalCommentors && canonicalCommentors.filter((uri) => shouldFilter(uri));
  const filteredSubs = canonicalSubs && canonicalSubs.filter((uri) => shouldFilter(uri, filteredCommentors));

  const allOptions = [];
  if (isEmote) {
    const emoteNames = EMOTES.map(({ name }) => name.toLowerCase());
    allOptions.push(...emoteNames);
  } else {
    if (canonicalCreatorUri) allOptions.push(canonicalCreatorUri);
    if (filteredSubs) allOptions.push(...filteredSubs);
    if (filteredCommentors) allOptions.push(...filteredCommentors);
  }

  const allOptionsGrouped =
    allOptions.length > 0
      ? allOptions.map((option) => {
          const groupName = isEmote
            ? __('Emotes')
            : (canonicalCreatorUri === option && __('Creator')) ||
              (filteredSubs && filteredSubs.includes(option) && __('Following')) ||
              (filteredCommentors && filteredCommentors.includes(option) && __('From comments'));

          return {
            label: isEmote ? option : option.replace('lbry://', '').replace('#', ':'),
            group: groupName,
          };
        })
      : [];

  const allMatches = useSuggestionMatch(
    suggestionTerm || '',
    allOptionsGrouped.map(({ label }) => label)
  );

  /** --------- **/
  /** Functions **/
  /** --------- **/

  function handleInputChange(value: string) {
    onChange({ target: { value } });

    const cursorIndex = inputRef && inputRef.current && inputRef.current.selectionStart;

    const suggestionMatches = value.match(SUGGESTION_REGEX);

    if (!suggestionMatches) {
      if (suggestionValue) setSuggestionValue(undefined);
      return; // Exit here and avoid unnecessary behavior
    }

    const exec = SUGGESTION_REGEX.exec(value);
    const groups = exec && exec.groups;
    const groupValue = groups && Object.keys(groups).find((group) => groups[group]);

    const previousLastIndexes = [];
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

      // $FlowFixMe
      setSuggestionValue({
        beforeTerm: currentSuggestionValue.substring(0, tokenIndex), // in case of a space or newline
        term: currentSuggestionValue.substring(tokenIndex),
        index: currentSuggestionIndex,
        lastIndex: currentLastIndex,
        isEmote,
      });
    }
  }

  const handleSelect = React.useCallback(
    (selectedValue: string) => {
      setSelectedValue(selectedValue);

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
      setSuggestionValue(undefined);
      elem.focus();
      elem.setSelectionRange(newCursorPos, newCursorPos);
    },
    [messageValue, inputRef, onChange, suggestionValue]
  );

  /** ------- **/
  /** Effects **/
  /** ------- **/

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

    function handleKeyDown(e: SyntheticKeyboardEvent<*>) {
      const { keyCode } = e;

      if (highlightedSuggestion && keyCode === KEYCODES.TAB) {
        e.preventDefault();
        handleSelect(highlightedSuggestion.label);
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSelect, highlightedSuggestion, suggestionTerm]);

  /** ------ **/
  /** Render **/
  /** ------ **/

  const renderGroup = (group: string, children: any) => (
    <div className="textareaSuggestions__group">
      <label className="textareaSuggestions__label">
        {group}
        {suggestionTerm && suggestionTerm.length > 1
          ? ' ' + __('matching %matching_term%', { matching_term: suggestionTerm })
          : ''}
      </label>
      {children}
      <hr className="textareaSuggestions__topSeparator" />
    </div>
  );

  const renderInput = (params: any) => {
    const { InputProps, disabled, fullWidth, id, inputProps: autocompleteInputProps } = params;
    const inputProps = { ...autocompleteInputProps, ...inputDefaultProps };
    const autocompleteProps = { InputProps, disabled, fullWidth, id, inputProps };

    return <TextField inputRef={inputRef} multiline select={false} {...autocompleteProps} />;
  };

  const renderOption = (optionProps: any, label: string) => {
    const emoteFound = isEmote && EMOTES.find(({ name }) => name.toLowerCase() === label);
    const emoteValue = emoteFound ? { name: label, url: emoteFound.url } : undefined;

    return <TextareaSuggestionsItem uri={label} emote={emoteValue} {...optionProps} />;
  };

  return (
    <Autocomplete
      autoHighlight
      disableClearable
      filterOptions={(options) => options.filter(({ label }) => allMatches && allMatches.includes(label))}
      freeSolo
      fullWidth
      getOptionLabel={(option) => option.label}
      groupBy={(option) => option.group}
      id={id}
      inputValue={messageValue}
      loading={!allMatches || allMatches.length === 0}
      loadingText={__('Nothing found')}
      onBlur={() => onBlur && onBlur()}
      /* Different from onInputChange, onChange is only used for the selected value,
        so here it is acting simply as a selection handler (see it as onSelect) */
      onChange={(event, value) => handleSelect(value.label)}
      onClose={(event, reason) => reason !== 'selectOption' && setClose(true)}
      onFocus={() => onFocus && onFocus()}
      onHighlightChange={(event, option) => setHighlightedSuggestion(option)}
      onInputChange={(event, value, reason) => reason === 'input' && handleInputChange(value)}
      onOpen={() => suggestionTerm && setClose(false)}
      /* 'open' is for the popper box component, set to check for a valid term
        or else it will be displayed all the time as empty */
      open={!!suggestionTerm && !shouldClose}
      options={allOptionsGrouped}
      renderGroup={({ group, children }) => renderGroup(group, children)}
      renderInput={(params) => renderInput(params)}
      renderOption={(optionProps, option) => renderOption(optionProps, option.label)}
      value={selectedValue}
    />
  );
}

function useSuggestionMatch(term: string, list: Array<string>) {
  const throttledTerm = useThrottle(term);

  return React.useMemo(() => {
    return !throttledTerm || throttledTerm.trim() === ''
      ? undefined
      : matchSorter(list, term, { keys: [(item) => item] });
  }, [list, term, throttledTerm]);
}
