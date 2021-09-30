// @flow
import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList } from '@reach/combobox';
import { Form } from 'component/common/form';
import { parseURI, regexInvalidURI } from 'lbry-redux';
import { SEARCH_OPTIONS } from 'constants/search';
import * as KEYCODES from 'constants/keycodes';
import ChannelMentionSuggestion from 'component/channelMentionSuggestion';
import ChannelMentionTopSuggestion from 'component/channelMentionTopSuggestion';
import React from 'react';
import Spinner from 'component/spinner';
import type { ElementRef } from 'react';
import useLighthouse from 'effects/use-lighthouse';

const INPUT_DEBOUNCE_MS = 1000;
const LIGHTHOUSE_MIN_CHARACTERS = 3;

type Props = {
  inputRef: any,
  mentionTerm: string,
  noTopSuggestion?: boolean,
  showMature: boolean,
  creatorUri: string,
  isLivestream: boolean,
  commentorUris: Array<string>,
  unresolvedCommentors: Array<string>,
  subscriptionUris: Array<string>,
  unresolvedSubscriptions: Array<string>,
  doResolveUris: (Array<string>) => void,
  customSelectAction?: (string, number) => void,
};

export default function ChannelMentionSuggestions(props: Props) {
  const {
    unresolvedCommentors,
    unresolvedSubscriptions,
    isLivestream,
    creatorUri,
    inputRef,
    showMature,
    noTopSuggestion,
    mentionTerm,
    doResolveUris,
    customSelectAction,
  } = props;
  const comboboxInputRef: ElementRef<any> = React.useRef();
  const comboboxListRef: ElementRef<any> = React.useRef();
  const [debouncedTerm, setDebouncedTerm] = React.useState('');

  const isRefFocused = (ref) => ref && ref.current === document.activeElement;

  const subscriptionUris = props.subscriptionUris.filter((uri) => uri !== creatorUri);
  const commentorUris = props.commentorUris.filter((uri) => uri !== creatorUri && !subscriptionUris.includes(uri));

  const termToMatch = mentionTerm && mentionTerm.replace('@', '').toLowerCase();
  const allShownUris = [creatorUri, ...subscriptionUris, ...commentorUris];
  const possibleMatches = allShownUris.filter((uri) => {
    try {
      const { channelName } = parseURI(uri);
      return channelName.toLowerCase().includes(termToMatch);
    } catch (e) {}
  });
  const hasSubscriptionsResolved =
    subscriptionUris &&
    !subscriptionUris.every((uri) => unresolvedSubscriptions && unresolvedSubscriptions.includes(uri));
  const hasCommentorsShown =
    commentorUris.length > 0 && commentorUris.some((uri) => possibleMatches && possibleMatches.includes(uri));

  const searchSize = 5;
  const additionalOptions = { isBackgroundSearch: false, [SEARCH_OPTIONS.CLAIM_TYPE]: SEARCH_OPTIONS.INCLUDE_CHANNELS };
  const { results, loading } = useLighthouse(debouncedTerm, showMature, searchSize, additionalOptions, 0);
  const stringifiedResults = JSON.stringify(results);

  const hasMinLength = mentionTerm && mentionTerm.length >= LIGHTHOUSE_MIN_CHARACTERS;
  const isTyping = debouncedTerm !== mentionTerm;
  const showPlaceholder = isTyping || loading;

  const isUriFromTermValid = !regexInvalidURI.test(mentionTerm.substring(1));

  const handleSelect = React.useCallback(
    (value, key) => {
      if (customSelectAction) {
        // Give them full results, as our resolved one might truncate the claimId.
        customSelectAction(value || (results && results.find((r) => r.startsWith(value))) || '', Number(key));
      }
    },
    [customSelectAction, results]
  );

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (isTyping) setDebouncedTerm(!hasMinLength ? '' : mentionTerm);
    }, INPUT_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [isTyping, mentionTerm, hasMinLength, possibleMatches.length]);

  React.useEffect(() => {
    if (!inputRef) return;

    if (mentionTerm && isUriFromTermValid) {
      inputRef.current.classList.add('textarea-mention');
    } else {
      inputRef.current.classList.remove('textarea-mention');
    }
  }, [inputRef, isUriFromTermValid, mentionTerm]);

  React.useEffect(() => {
    if (!inputRef || !comboboxInputRef || !mentionTerm) return;

    function handleKeyDown(event) {
      const { keyCode } = event;
      const activeElement = document.activeElement;

      if (keyCode === KEYCODES.UP || keyCode === KEYCODES.DOWN) {
        if (isRefFocused(comboboxInputRef)) {
          const selectedId = activeElement && activeElement.getAttribute('aria-activedescendant');
          const selectedItem = selectedId && document.querySelector(`li[id="${selectedId}"]`);
          if (selectedItem) selectedItem.scrollIntoView({ block: 'nearest', inline: 'nearest' });
        } else {
          comboboxInputRef.current.focus();
        }
      } else {
        if ((isRefFocused(comboboxInputRef) || isRefFocused(inputRef)) && keyCode === KEYCODES.TAB) {
          event.preventDefault();
          const activeValue = activeElement && activeElement.getAttribute('value');

          if (activeValue) {
            handleSelect(activeValue, keyCode);
          } else if (possibleMatches.length) {
            handleSelect(possibleMatches[0], keyCode);
          } else if (results) {
            handleSelect(mentionTerm, keyCode);
          }
        }
        if (isRefFocused(comboboxInputRef)) inputRef.current.focus();
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSelect, inputRef, mentionTerm, possibleMatches, results]);

  React.useEffect(() => {
    if (!stringifiedResults) return;

    const arrayResults = JSON.parse(stringifiedResults);
    if (arrayResults && arrayResults.length > 0) doResolveUris(arrayResults);
  }, [doResolveUris, stringifiedResults]);

  // Only resolve commentors on Livestreams if actually mentioning/looking for it
  React.useEffect(() => {
    if (isLivestream && unresolvedCommentors && mentionTerm) doResolveUris(unresolvedCommentors);
  }, [doResolveUris, isLivestream, mentionTerm, unresolvedCommentors]);

  // Only resolve the subscriptions that match the mention term, instead of all
  React.useEffect(() => {
    if (isTyping) return;

    const urisToResolve = [];
    subscriptionUris.map(
      (uri) =>
        hasMinLength &&
        possibleMatches.includes(uri) &&
        unresolvedSubscriptions.includes(uri) &&
        urisToResolve.push(uri)
    );

    if (urisToResolve.length > 0) doResolveUris(urisToResolve);
  }, [doResolveUris, hasMinLength, isTyping, possibleMatches, subscriptionUris, unresolvedSubscriptions]);

  const suggestionsRow = (label: string, suggestions: Array<string>, hasSuggestionsBelow: boolean) => {
    if (mentionTerm !== '@' && suggestions !== results) {
      suggestions = suggestions.filter((uri) => possibleMatches.includes(uri));
    } else if (suggestions === results) {
      suggestions = suggestions.filter((uri) => !allShownUris.includes(uri));
    }

    return !suggestions.length ? null : (
      <>
        <div className="channel-mention__label">{label}</div>
        {suggestions.map((uri) => (
          <ChannelMentionSuggestion key={uri} uri={uri} />
        ))}
        {hasSuggestionsBelow && <hr className="channel-mention__top-separator" />}
      </>
    );
  };

  return isRefFocused(inputRef) || isRefFocused(comboboxInputRef) ? (
    <Form onSubmit={() => handleSelect(mentionTerm)}>
      <Combobox className="channel-mention" onSelect={handleSelect}>
        <ComboboxInput ref={comboboxInputRef} className="channel-mention__input--none" value={mentionTerm} />
        {mentionTerm && isUriFromTermValid && (
          <ComboboxPopover portal={false} className="channel-mention__suggestions">
            <ComboboxList ref={comboboxListRef}>
              {creatorUri &&
                suggestionsRow(
                  __('Creator'),
                  [creatorUri],
                  hasSubscriptionsResolved || hasCommentorsShown || !showPlaceholder
                )}
              {hasSubscriptionsResolved &&
                suggestionsRow(__('Following'), subscriptionUris, hasCommentorsShown || !showPlaceholder)}
              {commentorUris.length > 0 && suggestionsRow(__('From comments'), commentorUris, !showPlaceholder)}

              {showPlaceholder
                ? hasMinLength && <Spinner type="small" />
                : results && (
                    <>
                      {!noTopSuggestion && <ChannelMentionTopSuggestion query={debouncedTerm} />}
                      {suggestionsRow(__('From search'), results, false)}
                    </>
                  )}
            </ComboboxList>
          </ComboboxPopover>
        )}
      </Combobox>
    </Form>
  ) : null;
}
