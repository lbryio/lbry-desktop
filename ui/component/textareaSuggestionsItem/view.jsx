// @flow
import ChannelThumbnail from 'component/channelThumbnail';
import React from 'react';
import PremiumBadge from 'component/premiumBadge';
import twemoji from 'twemoji';

type Props = {
  claimLabel?: string,
  claimTitle?: string,
  emote?: any,
  uri?: string,
  emoji?: string,
};

export default function TextareaSuggestionsItem(props: Props) {
  const { claimLabel, claimTitle, emote, uri, ...autocompleteProps } = props;

  const Twemoji = ({ emoji }) => (
    <span
      dangerouslySetInnerHTML={{
        __html: twemoji.parse(emoji, {
          folder: 'svg',
          ext: '.svg',
        }),
      }}
    />
  );

  if (emote) {
    const { name: value, url, unicode } = emote;

    return (
      <div {...autocompleteProps} dispatch={undefined}>
        {unicode ? (
          <div className="emote">
            <Twemoji emoji={unicode} />
          </div>
        ) : (
          <img className="emote" src={url} />
        )}

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
          <span className="textarea-suggestion__value">
            {value}
            <PremiumBadge uri={uri} />
          </span>
        </div>
      </div>
    );
  }

  return null;
}
