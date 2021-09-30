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
  isLivestream: boolean,
  creatorUri: string,
  commentorUris: Array<string>,
  subscriptionUris: Array<string>,
  unresolvedCommentors: Array<string>,
  unresolvedSubscriptions: Array<string>,
  canonicalCreator: string,
  canonicalCommentors: Array<string>,
  canonicalSubscriptions: Array<string>,
  doResolveUris: (Array<string>) => void,
  customSelectAction?: (string, number) => void,
};

export default function ChannelMentionSuggestions(props: Props) {
  const {
    unresolvedCommentors,
    unresolvedSubscriptions,
    canonicalCreator,
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

  const mainEl = document.querySelector('.channel-mention__suggestions');

  const [debouncedTerm, setDebouncedTerm] = React.useState('');
  const [mostSupported, setMostSupported] = React.useState('');
  const [canonicalResults, setCanonicalResults] = React.useState([]);

  const isRefFocused = (ref) => ref && ref.current === document.activeElement;

  const subscriptionUris = props.subscriptionUris.filter((uri) => uri !== creatorUri);
  const canonicalSubscriptions = props.canonicalSubscriptions.filter((uri) => uri !== canonicalCreator);
  const commentorUris = props.commentorUris.filter((uri) => uri !== creatorUri && !subscriptionUris.includes(uri));
  const canonicalCommentors = props.canonicalCommentors.filter(
    (uri) => uri !== canonicalCreator && !canonicalSubscriptions.includes(uri)
  );

  const termToMatch = mentionTerm && mentionTerm.replace('@', '').toLowerCase();
  const allShownUris = [creatorUri, ...subscriptionUris, ...commentorUris];
  const allShownCanonical = [canonicalCreator, ...canonicalSubscriptions, ...canonicalCommentors];
  const possibleMatches = allShownUris.filter((uri) => {
    try {
      const { channelName } = parseURI(uri);
      return channelName.toLowerCase().includes(termToMatch);
    } catch (e) {}
  });

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
  }, [hasMinLength, isTyping, mentionTerm]);

  React.useEffect(() => {
    if (!mainEl) return;
    const header = document.querySelector('.header__navigation');

    function handleReflow() {
      const boxAtTopOfPage = header && mainEl.getBoundingClientRect().top <= header.offsetHeight;
      const boxAtBottomOfPage = mainEl.getBoundingClientRect().bottom >= window.innerHeight;

      if (boxAtTopOfPage) {
        mainEl.setAttribute('flow-bottom', '');
      }
      if (mainEl.getAttribute('flow-bottom') !== null && boxAtBottomOfPage) {
        mainEl.removeAttribute('flow-bottom');
      }
    }
    handleReflow();

    window.addEventListener('scroll', handleReflow);
    return () => window.removeEventListener('scroll', handleReflow);
  }, [mainEl]);

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
          // $FlowFixMe
          comboboxInputRef.current.focus();
        }
      } else {
        if ((isRefFocused(comboboxInputRef) || isRefFocused(inputRef)) && keyCode === KEYCODES.TAB) {
          event.preventDefault();
          const activeValue = activeElement && activeElement.getAttribute('value');

          if (activeValue) {
            handleSelect(activeValue, keyCode);
          } else if (possibleMatches.length) {
            // $FlowFixMe
            const suggest = allShownCanonical.find((matchUri) => possibleMatches.find((uri) => uri.includes(matchUri)));
            if (suggest) handleSelect(suggest, keyCode);
          } else if (results) {
            handleSelect(mentionTerm, keyCode);
          }
        }
        if (isRefFocused(comboboxInputRef)) {
          // $FlowFixMe
          inputRef.current.focus();
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [allShownCanonical, handleSelect, inputRef, mentionTerm, possibleMatches, results]);

  React.useEffect(() => {
    if (!stringifiedResults) return;

    const arrayResults = JSON.parse(stringifiedResults);
    if (arrayResults && arrayResults.length > 0) {
      // $FlowFixMe
      doResolveUris(arrayResults).then((response) => {
        try {
          // $FlowFixMe
          const canonical_urls = Object.values(response).map(({ canonical_url }) => canonical_url);
          setCanonicalResults(canonical_urls);
        } catch (e) {}
      });
    }
  }, [doResolveUris, stringifiedResults]);

  // Only resolve commentors on Livestreams when actually mentioning/looking for it
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

  const suggestionsRow = (
    label: string,
    suggestions: Array<string>,
    canonical: Array<string>,
    hasSuggestionsBelow: boolean
  ) => {
    if (mentionTerm.length > 1 && suggestions !== results) {
      suggestions = suggestions.filter((uri) => possibleMatches.includes(uri));
    } else if (suggestions === results) {
      suggestions = suggestions
        .filter((uri) => !allShownUris.includes(uri))
        .filter((uri) => !uri.includes(mostSupported));
    }
    // $FlowFixMe
    suggestions = suggestions
      .map((matchUri) => canonical.find((uri) => matchUri.includes(uri)))
      .filter((uri) => Boolean(uri));

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
                  [canonicalCreator],
                  canonicalSubscriptions.length > 0 || commentorUris.length > 0 || !showPlaceholder
                )}
              {canonicalSubscriptions.length > 0 &&
                suggestionsRow(
                  __('Following'),
                  subscriptionUris,
                  canonicalSubscriptions,
                  commentorUris.length > 0 || !showPlaceholder
                )}
              {commentorUris.length > 0 &&
                suggestionsRow(__('From comments'), commentorUris, canonicalCommentors, !showPlaceholder)}

              {hasMinLength &&
                (showPlaceholder ? (
                  <Spinner type="small" />
                ) : (
                  results && (
                    <>
                      {!noTopSuggestion && (
                        <ChannelMentionTopSuggestion
                          query={debouncedTerm}
                          shownUris={allShownCanonical}
                          setMostSupported={(winningUri) => setMostSupported(winningUri)}
                        />
                      )}
                      {suggestionsRow(__('From search'), results, canonicalResults, false)}
                    </>
                  )
                ))}
            </ComboboxList>
          </ComboboxPopover>
        )}
      </Combobox>
    </Form>
  ) : null;
}
