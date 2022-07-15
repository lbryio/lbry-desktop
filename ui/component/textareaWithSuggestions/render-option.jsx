// @flow
import { EMOTES_48px as EMOTES } from 'constants/emotes';
import EMOJIS from 'emoji-dictionary';
import React from 'react';
import TextareaSuggestionsItem from 'component/textareaSuggestionsItem';

type Props = {
  label: string,
  isEmote?: boolean,
  optionProps: any,
};

const TextareaSuggestionsOption = (props: Props) => {
  const { label, isEmote, optionProps } = props;

  const emoteFound = isEmote && EMOTES.find(({ name }) => name === label);
  const emoteValue = emoteFound ? { name: label, url: emoteFound.url } : undefined;
  const emojiFound = isEmote && EMOJIS.getUnicode(label);
  const emojiValue = emojiFound ? { name: label, unicode: emojiFound } : undefined;

  return <TextareaSuggestionsItem key={label} uri={label} emote={emoteValue || emojiValue} {...optionProps} />;
};

export default TextareaSuggestionsOption;
