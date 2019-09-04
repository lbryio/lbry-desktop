// @flow
import React from 'react';

type Props = {
  tokens: Object,
  children: any,
};

export default function I18nMessage(props: Props) {
  const message = __(props.children),
    regexp = /%\w+%/g,
    matchingGroups = message.match(regexp);

  if (!matchingGroups) {
    return <React.Fragment>{message}</React.Fragment>;
  }

  const messageSubstrings = props.children.split(regexp),
    tokens = props.tokens;

  return (
    <React.Fragment>
      {messageSubstrings.map((substring, index) => {
        const token =
          index < matchingGroups.length ? matchingGroups[index].substring(1, matchingGroups[index].length - 1) : null; // get token without % on each side
        return (
          <React.Fragment key={index}>
            {substring}
            {token && tokens[token]}
          </React.Fragment>
        );
      })}
    </React.Fragment>
  );
}
