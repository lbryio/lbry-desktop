// @flow
import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList } from '@reach/combobox';
import { matchSorter } from 'match-sorter';
import { SEARCH_OPTIONS } from 'constants/search';
import * as KEYCODES from 'constants/keycodes';
import { regexInvalidURI } from 'util/lbryURI';
import React from 'react';
import Spinner from 'component/spinner';
import TextareaSuggestionsItem from 'component/textareaSuggestionsItem';
import TextareaTopSuggestion from 'component/textareaTopSuggestion';
import type { ElementRef } from 'react';
import useLighthouse from 'effects/use-lighthouse';
import useThrottle from 'effects/use-throttle';

const mentionRegex = /@[^\s"=?!@$%^&*;,{}<>/\\]*/gm;

const INPUT_DEBOUNCE_MS = 1000;
const LIGHTHOUSE_MIN_CHARACTERS = 4;
const SEARCH_SIZE = 10;

type Props = {
  canonicalCommentors: Array<string>,
  canonicalCreatorUri: string,
  canonicalSubscriptions: Array<string>,
  className?: string,
  commentorUris: Array<string>,
  doResolveUris: (Array<string>) => void,
  hideSuggestions?: boolean,
  inputRef: any,
  isLivestream?: boolean,
  maxLength?: number,
  name: string,
  noTopSuggestion?: boolean,
  placeholder?: string,
  showMature: boolean,
  type?: string,
  value: any,
  onChange: (any) => any,
};

export default function TextareaWithSuggestions(props: Props) {
  const {
    canonicalCommentors,
    canonicalCreatorUri,
    canonicalSubscriptions,
    className,
    commentorUris,
    doResolveUris,
    hideSuggestions,
    inputRef,
    isLivestream,
    maxLength,
    name,
    noTopSuggestion,
    placeholder,
    showMature,
    type,
    value: commentValue,
    onChange,
  } = props;

  const inputProps = { className, placeholder };

  const comboboxListRef: ElementRef<any> = React.useRef();

  const [suggestionValue, setSuggestionValue] = React.useState(undefined);
  const [debouncedTerm, setDebouncedTerm] = React.useState('');
  const [topSuggestion, setTopSuggestion] = React.useState('');
  const [canonicalSearchUris, setCanonicalSearchUris] = React.useState([]);

  const suggestionTerm = suggestionValue && suggestionValue.term;
  const isUriFromTermValid = suggestionTerm && !regexInvalidURI.test(suggestionTerm.substring(1));

  const additionalOptions = { isBackgroundSearch: false, [SEARCH_OPTIONS.CLAIM_TYPE]: SEARCH_OPTIONS.INCLUDE_CHANNELS };
  const { results, loading } = useLighthouse(debouncedTerm, showMature, SEARCH_SIZE, additionalOptions, 0);
  const stringifiedResults = JSON.stringify(results);

  const shouldFilter = (uri, previousLists) =>
    uri !== canonicalCreatorUri && (!previousLists || !previousLists.includes(uri));

  const filteredCommentors = canonicalCommentors.filter((uri) => shouldFilter(uri));
  const filteredSubs = canonicalSubscriptions.filter((uri) => shouldFilter(uri, filteredCommentors));
  const filteredTop = shouldFilter(topSuggestion, [...filteredCommentors, ...filteredSubs]) && topSuggestion;
  const filteredSearch =
    canonicalSearchUris &&
    canonicalSearchUris.filter((uri) => shouldFilter(uri, [...filteredCommentors, ...filteredSubs, filteredTop || '']));

  const creatorUriMatch = useSuggestionMatch(suggestionTerm || '', [canonicalCreatorUri]);
  const subscriptionsMatch = useSuggestionMatch(suggestionTerm || '', filteredSubs);
  const commentorsMatch = useSuggestionMatch(suggestionTerm || '', filteredCommentors);

  const hasMinSearchLength = suggestionTerm && suggestionTerm.length >= LIGHTHOUSE_MIN_CHARACTERS;
  const isTyping = suggestionValue && debouncedTerm !== suggestionValue.term;
  const showPlaceholder = hasMinSearchLength && (isTyping || loading);

  /** --------- **/
  /** Functions **/
  /** --------- **/

  function handleChange(e: SyntheticInputEvent<*>) {
    onChange(e);

    if (hideSuggestions) return;

    const { value } = e.target;

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
      if (!suggestionValue) return;

      const newValue =
        commentValue.substring(0, suggestionValue.index) + //                          1) From start of comment value until term start
        `${selectedValue}` + //                                                        2) Add the selected value
        (commentValue.length > suggestionValue.lastIndex //                            3) If there is more content until the the end of the comment value:
          ? commentValue.substring(suggestionValue.index + 1, commentValue.length) //   3.a) from term end, add the rest of comment value
          : ' '); //                                                                    3.b) or else, add a space for new input after

      onChange({ target: { value: newValue } });
      inputRef.current.focus();
    },
    [commentValue, inputRef, onChange, suggestionValue]
  );

  /** ------- **/
  /** Effects **/
  /** ------- **/

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (isTyping && suggestionValue) setDebouncedTerm(!hasMinSearchLength ? '' : suggestionValue.term);
    }, INPUT_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [hasMinSearchLength, isTyping, suggestionValue]);

  React.useEffect(() => {
    if (!stringifiedResults) return;

    const arrayResults = JSON.parse(stringifiedResults);
    if (doResolveUris && arrayResults && arrayResults.length > 0) {
      // $FlowFixMe
      doResolveUris(arrayResults)
        .then((response) => {
          try {
            // $FlowFixMe
            const canonical_urls = Object.values(response).map(({ canonical_url }) => canonical_url);
            setCanonicalSearchUris(canonical_urls);
          } catch (e) {}
        })
        .catch((e) => {});
    }
  }, [doResolveUris, stringifiedResults]);

  // Only resolve commentors on Livestreams when actually mentioning/looking for it
  React.useEffect(() => {
    if (isLivestream && commentorUris && suggestionValue) doResolveUris(commentorUris);
  }, [commentorUris, doResolveUris, isLivestream, suggestionValue]);

  React.useEffect(() => {
    if (!inputRef || !suggestionValue) return;

    function handleKeyDown(e: SyntheticKeyboardEvent<*>) {
      const { keyCode } = e;

      const activeSelection = document.querySelector('[data-reach-combobox-option][data-highlighted]');
      const firstValue = document.querySelectorAll('[data-reach-combobox-option] .textareaSuggestion__value')[0];

      if (keyCode === KEYCODES.UP || keyCode === KEYCODES.DOWN) {
        const selectedId = activeSelection && activeSelection.getAttribute('id');
        const selectedItem = selectedId && document.querySelector(`li[id="${selectedId}"]`);

        if (selectedItem) selectedItem.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      } else if (keyCode === KEYCODES.TAB) {
        e.preventDefault();

        const activeValue = document.querySelector(
          '[data-reach-combobox-option][data-highlighted] .textareaSuggestion__value'
        );

        if (activeValue && activeValue.innerText) {
          handleSelect(activeValue.innerText);
        } else if (firstValue && firstValue.innerText) {
          handleSelect(firstValue.innerText);
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSelect, inputRef, suggestionValue]);

  /** ------ **/
  /** Render **/
  /** ------ **/

  const suggestionsRow = (label: string, suggestions: any) => (
    <div className="textareaSuggestions__row">
      <div className="textareaSuggestions__label">{label}</div>

      {suggestions.map((suggestion) => (
        <TextareaSuggestionsItem key={suggestion} uri={suggestion} />
      ))}

      <hr className="textareaSuggestions__topSeparator" />
    </div>
  );

  return (
    <Combobox onSelect={handleSelect} aria-label={name}>
      {/* Regular Textarea Field */}
      <ComboboxInput
        {...inputProps}
        value={commentValue}
        as="textarea"
        id={name}
        maxLength={maxLength}
        onChange={(e) => handleChange(e)}
        ref={inputRef}
        selectOnClick
        type={type}
        autocomplete={false}
      />

      {/* Possible Suggestions Box */}
      {suggestionValue && isUriFromTermValid && (
        <ComboboxPopover persistSelection className="textarea__suggestions">
          <ComboboxList ref={comboboxListRef}>
            {creatorUriMatch && creatorUriMatch.length > 0 && suggestionsRow(__('Creator'), creatorUriMatch)}
            {subscriptionsMatch && subscriptionsMatch.length > 0 && suggestionsRow(__('Following'), subscriptionsMatch)}
            {commentorsMatch && commentorsMatch.length > 0 && suggestionsRow(__('From comments'), commentorsMatch)}

            {hasMinSearchLength &&
              (showPlaceholder ? (
                <Spinner type="small" />
              ) : (
                results && (
                  <>
                    {!noTopSuggestion && (
                      <TextareaTopSuggestion
                        query={debouncedTerm}
                        filteredTop={filteredTop}
                        setTopSuggestion={setTopSuggestion}
                      />
                    )}
                    {filteredSearch && filteredSearch.length > 0 && suggestionsRow(__('From search'), filteredSearch)}
                  </>
                )
              ))}
          </ComboboxList>
        </ComboboxPopover>
      )}
    </Combobox>
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
