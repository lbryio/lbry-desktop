// @flow
import { EMOTES_48px as EMOTES, TWEMOTEARRAY } from 'constants/emotes';
import React from 'react';
import TextareaSuggestionsItem from 'component/textareaSuggestionsItem';

type Props = {
  label: string,
  isEmote?: boolean,
  optionProps: any,
};

const TextareaSuggestionsOption = (props: Props) => {
  const { label, isEmote, optionProps } = props;

  const emoteFound =
    // $FlowIgnore
    isEmote && (EMOTES.find(({ name }) => name === label) || TWEMOTEARRAY.find(({ name }) => name === label));
  const emoteValue = emoteFound ? { name: label, url: emoteFound.url } : undefined;

  return <TextareaSuggestionsItem key={label} uri={label} emote={emoteValue} {...optionProps} />;
};

export default TextareaSuggestionsOption;
