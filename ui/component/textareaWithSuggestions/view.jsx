// @flow
import { matchSorter } from 'match-sorter';
import * as KEYCODES from 'constants/keycodes';
import Autocomplete from '@mui/material/Autocomplete';
import React from 'react';
import TextareaSuggestionsItem from 'component/textareaSuggestionsItem';
import TextField from '@mui/material/TextField';
import useThrottle from 'effects/use-throttle';

const mentionRegex = /@[^\s=&#:$@%?;/\\"<>%{}|^~[]*/gm;

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
    value: commentValue,
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

  const shouldFilter = (uri, previous) => uri !== canonicalCreatorUri && (!previous || !previous.includes(uri));
  const filteredCommentors = canonicalCommentors && canonicalCommentors.filter((uri) => shouldFilter(uri));
  const filteredSubs = canonicalSubs && canonicalSubs.filter((uri) => shouldFilter(uri, filteredCommentors));

  const allOptions = [];
  if (canonicalCreatorUri) allOptions.push(canonicalCreatorUri);
  if (filteredSubs) allOptions.push(...filteredSubs);
  if (filteredCommentors) allOptions.push(...filteredCommentors);

  const allOptionsGrouped =
    allOptions.length > 0
      ? allOptions.map((option) => {
          const groupName =
            (canonicalCreatorUri === option && __('Creator')) ||
            (filteredSubs && filteredSubs.includes(option) && __('Following')) ||
            (filteredCommentors && filteredCommentors.includes(option) && __('From comments'));

          return {
            uri: option.replace('lbry://', '').replace('#', ':'),
            group: groupName,
          };
        })
      : [];

  const allMatches = useSuggestionMatch(
    suggestionTerm || '',
    allOptionsGrouped.map(({ uri }) => uri)
  );

  /** --------- **/
  /** Functions **/
  /** --------- **/

  function handleInputChange(value: string) {
    onChange({ target: { value } });

    const cursorIndex = inputRef && inputRef.current && inputRef.current.selectionStart;
    const mentionMatches = value.match(mentionRegex);

    const matchIndexes = [];
    let mentionIndex;
    let mentionLastIndex;

    const mentionValue =
      mentionMatches &&
      mentionMatches.find((match, index) => {
        const previousIndex = matchIndexes[index - 1] + 1 || 0;
        mentionIndex = value.substring(previousIndex).search(mentionRegex) + previousIndex;
        matchIndexes.push(mentionIndex);

        // the current mention term will be the one on the text cursor's range,
        // in case of there being more in the same comment message
        if (matchIndexes) {
          mentionLastIndex = mentionIndex + match.length;

          if (cursorIndex >= mentionIndex && cursorIndex <= mentionLastIndex) {
            return match;
          }
        }
      });

    if (mentionValue) {
      // $FlowFixMe
      setSuggestionValue({ term: mentionValue, index: mentionIndex, lastIndex: mentionLastIndex });
    } else if (suggestionValue) {
      setSuggestionValue(undefined);
    }
  }

  const handleSelect = React.useCallback(
    (selectedValue: string) => {
      setSelectedValue(selectedValue);

      if (!suggestionValue) return;

      const elem = inputRef && inputRef.current;
      const newCursorPos = suggestionValue.index + selectedValue.length + 1;

      const newValue =
        commentValue.substring(0, suggestionValue.index) + //                          1) From start of comment value until term start
        `${selectedValue}` + //                                                        2) Add the selected value
        (commentValue.length > suggestionValue.lastIndex //                            3) If there is more content until the the end of the comment value:
          ? commentValue.substring(suggestionValue.lastIndex, commentValue.length) //   3.a) from term end, add the rest of comment value
          : ' '); //                                                                    3.b) or else, add a space for new input after

      onChange({ target: { value: newValue } });
      setSuggestionValue(undefined);
      elem.focus();
      elem.setSelectionRange(newCursorPos, newCursorPos);
    },
    [commentValue, inputRef, onChange, suggestionValue]
  );

  /** ------- **/
  /** Effects **/
  /** ------- **/

  // For disabling sending on Enter on Livestream chat
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
    function handleKeyDown(e: SyntheticKeyboardEvent<*>) {
      const { keyCode } = e;

      if (highlightedSuggestion && keyCode === KEYCODES.TAB) {
        e.preventDefault();
        handleSelect(highlightedSuggestion.uri);
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSelect, highlightedSuggestion]);

  /** ------ **/
  /** Render **/
  /** ------ **/

  const renderGroup = (group: string, children: any) => (
    <div className="textareaSuggestions__group">
      <label className="textareaSuggestions__label">{group}</label>
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

  return (
    <Autocomplete
      autoHighlight
      disableClearable
      filterOptions={(options) => options.filter(({ uri }) => allMatches && allMatches.includes(uri))}
      freeSolo
      fullWidth
      getOptionLabel={(option) => option.uri}
      groupBy={(option) => option.group}
      id={id}
      inputValue={commentValue}
      loading={!allMatches || allMatches.length === 0}
      loadingText={__('Nothing found')}
      onBlur={() => onBlur()}
      /* Different from onInputChange, onChange is only used for the selected value,
        so here it is acting simply as a selection handler (see it as onSelect) */
      onChange={(event, value) => handleSelect(value.uri)}
      onClose={(event, reason) => reason !== 'selectOption' && setClose(true)}
      onFocus={() => onFocus()}
      onHighlightChange={(event, option) => setHighlightedSuggestion(option)}
      onInputChange={(event, value, reason) => reason === 'input' && handleInputChange(value)}
      onOpen={() => suggestionTerm && setClose(false)}
      /* 'open' is for the popper box component, set to check for a valid term
        or else it will be displayed all the time as empty */
      open={!!suggestionTerm && !shouldClose}
      options={allOptionsGrouped}
      renderGroup={({ group, children }) => renderGroup(group, children)}
      renderInput={(params) => renderInput(params)}
      renderOption={(optionProps, option) => <TextareaSuggestionsItem uri={option.uri} {...optionProps} />}
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
