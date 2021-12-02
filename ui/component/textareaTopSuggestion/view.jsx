// @flow
import TextareaSuggestionsItem from 'component/textareaSuggestionsItem';
import LbcSymbol from 'component/common/lbc-symbol';
import React from 'react';

type Props = {
  filteredTop: string,
  isResolvingUri: boolean,
  uriFromQuery: string,
  winningUri: string,
  doResolveUri: (string) => void,
  setTopSuggestion: (string) => void,
};

export default function TextareaTopSuggestion(props: Props) {
  const { filteredTop, isResolvingUri, uriFromQuery, winningUri, doResolveUri, setTopSuggestion } = props;

  React.useEffect(() => {
    if (uriFromQuery) doResolveUri(uriFromQuery);
  }, [doResolveUri, uriFromQuery]);

  React.useEffect(() => {
    if (winningUri) setTopSuggestion(winningUri);
  }, [setTopSuggestion, winningUri]);

  if (isResolvingUri) {
    return (
      <div className="textareaSuggestion">
        <div className="media__thumb media__thumb--resolving" />
      </div>
    );
  }

  return filteredTop && filteredTop.length > 0 ? (
    <div className="textareaSuggestions__row">
      <div className="textareaSuggestions__label">
        <LbcSymbol prefix={__('Most Supported')} />
      </div>

      <TextareaSuggestionsItem uri={filteredTop} />
      <hr className="textareaSuggestions__topSeparator" />
    </div>
  ) : null;
}
