// @flow
import 'scss/component/_emote-selector.scss';
import { EMOTES_48px as EMOTES } from 'constants/emotes';
import * as ICONS from 'constants/icons';
import Button from 'component/button';
import EMOJIS from 'emoji-dictionary';
import OptimizedImage from 'component/optimizedImage';
import React from 'react';

const OLD_QUICK_EMOJIS = [
  EMOJIS.getUnicode('rocket'),
  EMOJIS.getUnicode('jeans'),
  EMOJIS.getUnicode('fire'),
  EMOJIS.getUnicode('heart'),
  EMOJIS.getUnicode('open_mouth'),
];

type Props = { commentValue: string, setCommentValue: (string) => void, closeSelector: () => void };

export default function EmoteSelector(props: Props) {
  const { commentValue, setCommentValue, closeSelector } = props;

  function addEmoteToComment(emote: string) {
    setCommentValue(
      commentValue + (commentValue && commentValue.charAt(commentValue.length - 1) !== ' ' ? ` ${emote} ` : `${emote} `)
    );
  }

  return (
    <div className="emoteSelector">
      <Button button="close" icon={ICONS.REMOVE} onClick={closeSelector} />

      <div className="emoteSelector__list">
        <div className="emoteSelector__listRow">
          <div className="emoteSelector__listRowItems">
            {OLD_QUICK_EMOJIS.map((emoji) => (
              <Button
                key={emoji}
                label={emoji}
                title={`:${EMOJIS.getName(emoji)}:`}
                button="alt"
                className="button--file-action"
                onClick={() => addEmoteToComment(emoji)}
              />
            ))}
            {EMOTES.map((emote) => {
              const emoteName = emote.name;

              return (
                <Button
                  key={emoteName}
                  title={emoteName}
                  button="alt"
                  className="button--file-action"
                  onClick={() => addEmoteToComment(emoteName)}
                >
                  <OptimizedImage src={emote.url} waitLoad />
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
