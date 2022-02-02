// @flow
import ChannelThumbnail from 'component/channelThumbnail';
import React from 'react';

type Props = {
  claimLabel?: string,
  claimTitle?: string,
  emote?: any,
  uri?: string,
};

export default function TextareaSuggestionsItem(props: Props) {
  const { claimLabel, claimTitle, emote, uri, ...autocompleteProps } = props;

  if (emote) {
    const { name: value, url, unicode } = emote;

    return (
      <div {...autocompleteProps} dispatch={undefined}>
        {unicode ? <div className="emote">{unicode}</div> : <img className="emote" src={url} />}

        <div className="textarea-suggestion__label">
          <span className="textarea-suggestion__title textarea-suggestion__value textarea-suggestion__value--emote">
            {value}
          </span>
        </div>
      </div>
    );
  }

  if (claimLabel) {
    const value = claimLabel;

    return (
      <div {...autocompleteProps} dispatch={undefined}>
        <ChannelThumbnail xsmall uri={uri} />

        <div className="textarea-suggestion__label">
          <span className="textarea-suggestion__title">{claimTitle || value}</span>
          <span className="textarea-suggestion__value">{value}</span>
        </div>
      </div>
    );
  }

  return null;
}
