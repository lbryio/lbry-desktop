// @flow
import React from 'react';

import './style.scss';
import Entry from './entry/view';
import SortableList from './sortableList';

import { FormField } from 'component/common/form-components/form-field';
import Spinner from 'component/spinner';

import { URL } from 'config';
import * as ICONS from 'constants/icons';
import { LIGHTHOUSE_MIN_CHARACTERS, SEARCH_OPTIONS } from 'constants/search';
import useLighthouse from 'effects/use-lighthouse';
import { getUriForSearchTerm } from 'util/search';
import { isNameValid, parseURI } from 'util/lbryURI';

type Props = {
  selectedUris: Array<string>,
  onSelectedUrisChanged: (
    change: 'remove' | 'add' | 'reorder',
    params: { uri?: string, to?: number, from?: number }
  ) => void,
  label?: Node,
  placeholder?: string,
  // --- redux ---
  claimsByUri: { [string]: Claim },
  resolvingUris: Array<string>,
  subscriptionUris: Array<string>,
  doResolveUris: (uris: Array<string>, cache: boolean) => Promise<any>,
  doSetMentionSearchResults: (query: string, uris: Array<string>) => void,
};

export default function ChannelFinder(props: Props) {
  const {
    label,
    placeholder,
    selectedUris,
    onSelectedUrisChanged,
    claimsByUri,
    resolvingUris,
    subscriptionUris,
    doResolveUris,
    doSetMentionSearchResults,
  } = props;

  const [searchTerm, setSearchTerm] = React.useState('');
  const [searchTermDebounced, setSearchTermDebounced] = React.useState('');

  // --- URL/SDK search ---
  const isUrl = isUrlBasedInput(searchTerm);
  const [uriSearchTerm, setUriSearchTerm] = React.useState('');
  const [uriSearchTermError, setUriSearchTermError] = React.useState('');
  const [isResolvingUri, setIsResolvingUri] = React.useState(false);
  const resolvedUri = claimsByUri[uriSearchTerm]?.permanent_url;

  // --- Lighthouse search ---
  const additionalOptions = { isBackgroundSearch: false, [SEARCH_OPTIONS.CLAIM_TYPE]: SEARCH_OPTIONS.INCLUDE_CHANNELS };
  const lighthouseResponse = useLighthouse(getLhTerm(searchTermDebounced), false, 15, additionalOptions, 0);
  const urisStringified = JSON.stringify(lighthouseResponse.results);

  const [showSubscriptions, setShowSubscriptions] = React.useState(false);

  // **************************************************************************
  // **************************************************************************

  const CenteredSpinner = (props: {}) => (
    <div className="main--empty">
      <Spinner />
    </div>
  );

  const LighthouseResults = (props: {}) => (
    <>
      {!lighthouseResponse.loading &&
        searchTerm?.length >= LIGHTHOUSE_MIN_CHARACTERS &&
        lighthouseResponse.results &&
        lighthouseResponse.results
          .filter((uri) => uri !== resolvedUri)
          .map((uri) => (
            <Entry
              key={uri}
              uri={uri}
              claim={claimsByUri[uri]}
              resolvingUris={resolvingUris}
              onClick={(e) => handleSuggestionClicked(uri)}
              iconRight={selectedUris.includes(uri) ? ICONS.COMPLETE : undefined}
              hideInvalid
            />
          ))}
    </>
  );

  const UriSearchResult = (props: {}) => (
    <>
      {!isResolvingUri && (
        <>
          {claimsByUri[uriSearchTerm] ? (
            <Entry
              key={claimsByUri[uriSearchTerm].permanent_url}
              uri={claimsByUri[uriSearchTerm].permanent_url}
              claim={claimsByUri[uriSearchTerm]}
              resolvingUris={resolvingUris}
              onClick={(e) => handleSuggestionClicked(claimsByUri[uriSearchTerm].permanent_url)}
              iconRight={selectedUris.includes(claimsByUri[uriSearchTerm].permanent_url) ? ICONS.COMPLETE : undefined}
              hideInvalid
            />
          ) : isUrl ? (
            <div className="main--empty">{__('No results')}</div>
          ) : null}
        </>
      )}
    </>
  );

  const MiscSuggestions = (props: {}) => {
    const show = showSubscriptions && subscriptionUris.length > 0 && !lighthouseResponse.loading;
    return show ? (
      <div className="channel-finder__misc-suggestions">
        <label>{__('Following')}</label>
        {subscriptionUris.map((uri) => (
          <Entry
            key={uri}
            uri={uri}
            claim={claimsByUri[uri]}
            resolvingUris={resolvingUris}
            onClick={(e) => handleSuggestionClicked(uri)}
            iconRight={selectedUris.includes(uri) ? ICONS.COMPLETE : undefined}
            hideInvalid
          />
        ))}
      </div>
    ) : null;
  };

  // **************************************************************************
  // **************************************************************************

  function isUrlBasedInput(str) {
    return str.startsWith(`${URL}`) || str.startsWith('lbry://');
  }

  function getLhTerm(term) {
    // This should be moved into `useLighthouse`
    return searchTerm && searchTerm.length >= LIGHTHOUSE_MIN_CHARACTERS ? searchTerm : '';
  }

  function handleKeyPress(e) {
    // We have to use 'e.key' instead of 'e.keyCode' in this event.
    // if (e.key === 'Enter' && addTagRef && addTagRef.current && addTagRef.current.click) {
    //   e.preventDefault();
    //   addTagRef.current.click();
    // }
  }

  function handleSuggestionClicked(uri: string) {
    onSelectedUrisChanged(selectedUris.includes(uri) ? 'remove' : 'add', { uri });
  }

  function handleSelectedItemClicked(uri) {
    onSelectedUrisChanged('remove', { uri });
  }

  function handleSelectedItemDragged(result) {
    const { source, destination } = result;
    onSelectedUrisChanged('reorder', { from: source.index, to: destination.index });
  }

  // **************************************************************************
  // **************************************************************************

  // -- Debounce searchTerm
  React.useEffect(() => {
    if (searchTermDebounced !== searchTerm) {
      const timer = setTimeout(() => {
        setSearchTermDebounced(searchTerm);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [searchTerm, searchTermDebounced]);

  // -- Resolve and store lighthouse results
  React.useEffect(() => {
    const uris = lighthouseResponse.results;

    if (searchTermDebounced && uris && uris.length > 0) {
      doResolveUris(uris, true);
      doSetMentionSearchResults(searchTermDebounced, uris);
    }
    // 1. urisStringified covers 'lighthouseResponse.results' (should be in sync).
    // 2. Ignore functions as they won't change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urisStringified, searchTermDebounced]);

  // -- URI-based results
  React.useEffect(() => {
    setUriSearchTermError('');
    setUriSearchTerm('');

    if (searchTermDebounced) {
      // QoL: Try to resolve even in LH mode; term can be close to a url, e.g. "miko:f" or "@miko:f".
      const term = isUrl
        ? searchTermDebounced
        : `lbry://${!searchTermDebounced.startsWith('@') ? '@' : ''}${searchTermDebounced}`;
      const [uri, error] = getUriForSearchTerm(term);

      if (error) {
        setUriSearchTermError(error);
      } else if (uri.length > 'lbry://'.length) {
        try {
          const { streamName, channelName, isChannel } = parseURI(uri);
          if (!isChannel && streamName && isNameValid(streamName)) {
            setUriSearchTermError(__('Not a valid channel URL'));
          } else if (isChannel && channelName && isNameValid(channelName)) {
            setUriSearchTerm(uri);
            setIsResolvingUri(true);
            doResolveUris([uri], true).finally(() => setIsResolvingUri(false));
          }
        } catch (e) {
          setUriSearchTermError(e.message);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUrl, searchTermDebounced]);

  // --- Resolve subscriptions
  React.useEffect(() => {
    doResolveUris(subscriptionUris, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- on mount
  }, []);

  // **************************************************************************
  // **************************************************************************

  if (!selectedUris || !onSelectedUrisChanged) {
    console.error('ChannelFinder: missing parameters'); // eslint-disable-line no-console
    return null;
  }

  return (
    <div className="channel-finder">
      <div className="channel-finder__top">
        <div className="channel-finder__input">
          <FormField
            type="text"
            name="search_term"
            className="form-field--address"
            label={label}
            placeholder={`\u{1F50E} ${placeholder || __('Enter channel name or URL')}`}
            value={searchTerm}
            error={isUrl && uriSearchTermError}
            onKeyPress={(e) => handleKeyPress(e)}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="channel-finder__middle">
        <div className="channel-finder__suggestion-list">
          {lighthouseResponse.loading || isResolvingUri ? (
            <CenteredSpinner />
          ) : (
            <>
              {uriSearchTerm && <UriSearchResult />}
              {!isUrl && <LighthouseResults />}
              <MiscSuggestions />
            </>
          )}
        </div>
        <div className="channel-finder__selected-list">
          <div className="channel-finder__selected-list-label">{__('Selected channels')}</div>
          <SortableList
            list={selectedUris}
            onGetElemAtIndex={(uri, index) => (
              <Entry
                key={uri}
                uri={uri}
                claim={claimsByUri[uri]}
                resolvingUris={resolvingUris}
                onClick={(e) => handleSelectedItemClicked(uri)}
                iconRight={ICONS.DELETE}
                iconRightOnHoverOnly
                iconRightErrorColor
              />
            )}
            onDragEnd={handleSelectedItemDragged}
          />
        </div>
      </div>
      <div className="channel-finder__bottom">
        <FormField
          type="checkbox"
          name="suggest_followed_channels"
          label={__('Suggest followed channels')}
          checked={showSubscriptions}
          onChange={() => setShowSubscriptions((prev) => !prev)}
        />
      </div>
    </div>
  );
}
